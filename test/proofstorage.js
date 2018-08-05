var ProofStorage = artifacts.require("./ProofStorage.sol");

contract('ProofStorage', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1];
  const bob = accounts[2];

  const validProof = "Proof";
  const invalidProof = "Poof";

  it("should create and get a new proof", async () => {
    const proofStorage = await ProofStorage.deployed();

    await proofStorage.provideProof(validProof, {from: alice});

    const logNewProof = await proofStorage.LogNewProof();
    const log = await new Promise(function(resolve, reject) {
      logNewProof.watch(function(error, log){ resolve(log);});
    });

    const logAddress = log.args._address;
    const logProof = log.args._proof;
    const logCreated = log.args._timestamp;
    const logState = log.args._state;

    const proof = await proofStorage.getProof.call(validProof);

    assert.notEmpty(proof, "Sould be Array[4]")
    assert.equal(logAddress, alice, "Should match Alice's address");
    assert.equal(logProof, validProof, "Should match " + proof);
    assert.equal(logProof, validProof, "Should match " + proof);
    assert.equal(logState, 1, "Should be Generated (1)");
    assert.isAtLeast(logCreated.toNumber(), 1, "Should be greater than 0");
  });

  it("should fail to get a non existing proof", async () => {
    const proofStorage = await ProofStorage.deployed();
    let err = null;

    try {
      await proofStorage.getProof.call(invalidProof)
    } catch (error) {
      err = error
    }

    assert.ok(err instanceof Error)
  });

  // it("should change the proof state to ", async () => {
  //   const proofStorage = await ProofStorage.deployed();
  //   let err = null;

  //   try {
  //     await proofStorage.getProof.call(invalidProof)
  //   } catch (error) {
  //     err = error
  //   }

  //   assert.ok(err instanceof Error)
  // });
});