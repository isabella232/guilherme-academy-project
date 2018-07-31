var ProofStorage = artifacts.require("./ProofStorage.sol");

contract('ProofStorage', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1];
  const bob = accounts[2];

  const validProof = "Proof";
  const invalidProof = "Poof";

  it("should create a new proof", async () => {
    const proofStorage = await ProofStorage.deployed();

    await proofStorage.provideProof(validProof);

    const proof = await proofStorage.getProof.call(validProof);

    assert.notEmpty(proof, "Should return Array(3)");
  });

  it("should return an error if proof doesn't exist", async () => {
    const proofStorage = await ProofStorage.deployed();

    const proof = await proofStorage.getProof.call(invalidProof);

    assert.notEmpty(proof, "Should not return Array(3)");
  });

});
