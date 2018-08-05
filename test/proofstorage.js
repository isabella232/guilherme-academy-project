var ProofStorage = artifacts.require("./ProofStorage.sol");

contract('ProofStorage', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1];
  const bob = accounts[2];

  const validProof = "Proof";
  const invalidProof = "Poof";

  it("should trigger the emergency stop to true", async () => {
    const proofStorage = await ProofStorage.deployed();

    await proofStorage.triggerLock();
    
    const logLockTriggered = await proofStorage.LogLockTriggered();
    const log = await new Promise(function(resolve, reject) {
      logLockTriggered.watch(function(error, log){ resolve(log);});
    });

    assert.equal(await proofStorage.lock.call(), true, "Should return true");
  });

  it("should fail to create a proof, since contract is locked", async () => {
    const proofStorage = await ProofStorage.deployed();
    let err = null;

    try {
      await proofStorage.provideProof(validProof, {from: alice});
    } catch (error) {
      err = error
    }

    assert.ok(err instanceof Error)
  });

  it("should trigger the emergency stop to false", async () => {
    const proofStorage = await ProofStorage.deployed();

    await proofStorage.triggerLock();

    assert.equal(await proofStorage.lock.call(), false, "Should return false");
  });

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

  it("should fail to create an already existing proof", async () => {
    const proofStorage = await ProofStorage.deployed();
    let err = null;

    try {
      await proofStorage.provideProof(validProof, {from: alice});
    } catch (error) {
      err = error
    }

    assert.ok(err instanceof Error)
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

  it("should fail to change the proof state to Acknowledged, since it's not the owner", async () => {
    const proofStorage = await ProofStorage.deployed();
    let err = null;

    try {
      await proofStorage.aknowledgeProof(validProof, {from: alice});
    } catch (error) {
      err = error
    }

    assert.ok(err instanceof Error)
  });

  it("should change the proof state to Acknowledged", async () => {
    const proofStorage = await ProofStorage.deployed();

    await proofStorage.aknowledgeProof(validProof);

    const logProofAcknowledged = await proofStorage.LogProofAcknowledged();
    const log = await new Promise(function(resolve, reject) {
      logProofAcknowledged.watch(function(error, log){ resolve(log);});
    });
    const logState = log.args._state;

    assert.equal(logState, 2, "Should be Generated (1)");
  });

  it("should change the proof state to Verified", async () => {
    const proofStorage = await ProofStorage.deployed();

    await proofStorage.verifyProof(validProof);

    const logProofVerified = await proofStorage.LogProofVerified();
    const logProof = await new Promise(function(resolve, reject) {
      logProofVerified.watch(function(error, log){ resolve(log);});
    });
    const logState = logProof.args._state;

    const logProofPayout = await proofStorage.LogProofPayout();
    const logPay = await new Promise(function(resolve, reject) {
      logProofPayout.watch(function(error, log){ resolve(log);});
    });
    const logPayout = logPay.args._amount;

    assert.equal(logState, 3, "Should be Generated (1)");
    assert.equal(logPayout, 20, "Should have sent 20");
  });

  it("should fail to change the proof state to Discarded, since it's already in a final state", async () => {
    const proofStorage = await ProofStorage.deployed();
    let err = null;

    try {
      await proofStorage.discardProof(validProof, {from: alice});
    } catch (error) {
      err = error
    }

    assert.ok(err instanceof Error)
  });
});