pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProofStorage.sol";

contract TestProofStorage {

    function testItMatchesOwner() public {
        ProofStorage proofStorage = ProofStorage(DeployedAddresses.ProofStorage());

        Assert.equal(proofStorage.owner(), msg.sender, "The owner doesn't match the deployer");
    }

    function testItLocksContract() public {
        ProofStorage proofStorage = new ProofStorage();

        proofStorage.triggerLock();

        bool lock = proofStorage.lock();

        Assert.equal(lock, true, "The contract didn't lock");
    }

}
