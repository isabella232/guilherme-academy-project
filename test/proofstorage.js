var ProofStorage = artifacts.require("./ProofStorage.sol");

contract('ProofStorage', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1];
  const bob = accounts[2];

  const validProof = "Proof";
  const invalidProof = "Poof";

  it("should create a new proof", async () => {
    const proofStorage = await ProofStorage.deployed();

    await proofStorage.provideProof(validProof, {from: alice});

    const logNewProof = await proofStorage.LogNewProof();
    const log = await new Promise(function(resolve, reject) {
      logNewProof.watch(function(error, log){ resolve(log);});
    });

    const logAddress = log.args._address;
    const logProof = log.args._proof;
    const logCreated = log.args._timestamp;

    const proof = await proofStorage.getProof.call(validProof);

    assert.notEmpty(proof, "Sould be Array[3]")
    assert.equal(logAddress, alice, "Should match Alice's address");
    assert.equal(logProof, validProof, "Should match " + proof);
    assert.equal(logProof, validProof, "Should match " + proof);
    assert.isAtLeast(logCreated.toNumber(), 1, "Should be greater than 0");
  });

  // it("should return an error if proof doesn't exist", async () => {
  //   const proofStorage = await ProofStorage.deployed();

  //   const proof = await proofStorage.getProof.call(invalidProof);

  //   assert.fail("0x", proof[2], "Excpetion not thorwn: Should not return Array(3)");
  // });

});
