App = {
  web3Provider: null,
  ipfs: null,
  contracts: {},
  proofs: [],

  init: function () {

    return App.initWeb3();
  },

  initWeb3: function () {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('ProofStorage.json', function (data) {
      var ProofStorageArtifact = data;
      App.contracts.ProofStorage = TruffleContract(ProofStorageArtifact);
      App.contracts.ProofStorage.setProvider(App.web3Provider);

      return App.initIPFS();
    });

  },

  initIPFS: function () {
    const ipfs = new Ipfs({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
    });
    App.ipfs = ipfs;

    return App.bindEvents();
  },

  bindEvents: async function () {
    $(document).on('click', '.btn-add-proof', App.newProof);

    var proofStorageInstance = await App.contracts.ProofStorage.deployed();
    const logNewProof = await proofStorageInstance.LogNewProof();
    logNewProof.watch(function (error, log) {
      App.proofs.push(log.args)
      App.loadProofs()
    });
  },

  newProof: async function () {
    event.preventDefault();

    $(".showbox").toggle();

    const proof = document.getElementById('proofInput').value
    var ipfsOut = await App.ipfs.files.add(new App.ipfs.types.Buffer(proof))

    const proofStorageInstance = await App.contracts.ProofStorage.deployed();
    await proofStorageInstance.provideProof(ipfsOut[0].hash, {
      from: web3.eth.accounts[0],
      gas: 100000
    });

  },

  loadProofs: function () {
    var proofsRow = $('#proofsRow');
    proofsRow.empty();
    var proofTemplate = $('#proofTemplate');
    for (i = 0; i < App.proofs.length; i++) {
      proofTemplate.find('.panel-title').text("Proof");
      proofTemplate.find('img').attr('src', './images/boxer.jpeg');
      proofTemplate.find('.proof-name').text(App.proofs[i]._proof);
      proofTemplate.find('.proof-sender').text(App.proofs[i]._address);
      proofTemplate.find('.proof-status').text(App.proofs[i]._state.toNumber());
      if (App.proofs[i]._state.toNumber() == 1) {
        proofTemplate.find('.btn-state').attr('class', 'btn btn-state btn-ack btn-primary');
        proofTemplate.find('.btn-state').html('Acknowledge');
      } else if (App.proofs[i]._state.toNumber() == 2) {
        proofTemplate.find('.btn-state').attr('class', 'btn btn-state btn-ver btn-success');
        proofTemplate.find('.btn-state').html('Verify');
      } else if (App.proofs[i]._state.toNumber() == 3) {
        proofTemplate.find('.btn-state').attr('class', 'btn btn-state btn-dis btn-danger');
        proofTemplate.find('.btn-state').html('Discard');
      }

      proofsRow.append(proofTemplate.html());
    }

    $(".showbox").toggle();
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});