pragma solidity ^0.4.24;

/** @title Proof Storage */
contract ProofStorage {

    /** @dev Owner being the platform admin
      */
    address public owner;

    /** @dev Locking bool
      */
    bool public lock;

    /** @dev Every proof can have the following states: Empty, Generated, Acknowledged, Verified, Discarded
      */
    enum State { Empty, Generated, Acknowledged, Verified, Discarded }
    

    /** @dev Logs a New proof
      */
    event LogNewProof(string _proof, address _address, State _state, uint _timestamp);
    /** @dev Logs an Acknowledged proof 
      */
    event LogProofAcknowledged(string _proof, address _address, State _state, uint _timestamp);
    /** @dev Logs a Verified proof
      */
    event LogProofVerified(string _proof, address _address, State _state, uint _timestamp);
    /** @dev Logs a Discarded proof
      */
    event LogProofDiscarded(string _proof, address _address, State _state, uint _timestamp);
    /** @dev Logs a Payout proof
      */
    event LogProofPayout(string _proof, address _address, State _state, uint _amount, uint _timestamp);
    /** @dev Logs a contract Locked state
      */
    event LogLockTriggered(bool _lock);

    /** @dev Structure of a proof
      * @param created Creation date
      * @param stateChanged Updated date
      * @param state Current state
      * @param sender User address
      */
    struct Proof {
        uint created;
        uint stateChanged;
        State state;
        address sender;
    }
    
    /** @dev Maps each proof structure to the actual Proof
      */
    mapping(string => Proof) proofs;

    constructor() public {
        owner = msg.sender;
    }
    
    /** @dev Verifies if it is the owner
      */
    modifier isOwner() {
        require(owner == msg.sender, "Sender address doesn't match owner");
        _;
    }
    
    /** @dev Verifies if it is the owner or the creator of the Proof
      * @param _proof String representing the Proof
      */
    modifier isCreaterOrOwner(string _proof) {
        require((proofs[_proof].sender == msg.sender) || (owner == msg.sender), "Sender address doesn't match owner or proof creator");
        _;
    }
    
    /** @dev Verifies the locked state of the contract
      */
    modifier isNotLocked() {
        require(!lock, "Contract is locked");
        _;
    }

    /** @dev Verifies if Proof exists
      * @param _proof String representing the Proof
      */
    modifier isProof(string _proof) {
        require(proofs[_proof].state != State.Empty, "Proof doesn't exist");
        _;
    }
    
    /** @dev Verifies if Proof is in the Empty state
      * @param _proof String representing the Proof
      */
    modifier isEmpty(string _proof) {
        require(proofs[_proof].state == State.Empty, "Proof needs to be on an Empty state");
        _;
    }
    
    /** @dev Verifies if Proof is in the Genereated state
      * @param _proof String representing the Proof
      */
    modifier isGenerated(string _proof) {
        require(proofs[_proof].state == State.Generated, "Proof needs to be on a Generated state");
        _;
    }
    
    /** @dev Verifies if Proof is in the Aknowledged state
      * @param _proof String representing the Proof
      */
    modifier isAknowledge(string _proof) {
        require(proofs[_proof].state == State.Acknowledged, "Proof needs to be on an Acknowledged state");
        _;
    }

    /** @dev Triggers the locking/unlocking of the contract
      */
    function triggerLock()
    public isOwner() {
        lock = !lock;
        emit LogLockTriggered(lock);
    }
    
    /** @dev Creates a new Proof
      * @param _proof String representing the Proof
      */
    function provideProof(string _proof) 
    public isNotLocked() isEmpty(_proof) {
        proofs[_proof] = Proof(block.timestamp, block.timestamp, State.Generated, msg.sender);
        emit LogNewProof(_proof, proofs[_proof].sender, proofs[_proof].state, proofs[_proof].stateChanged);
    }
    
    /** @dev Aknowledges a Proof
      * @param _proof String representing the Proof
      */
    function aknowledgeProof(string _proof) 
    public isNotLocked() isOwner() isGenerated(_proof) {
        proofs[_proof].state = State.Acknowledged;
        emit LogProofAcknowledged(_proof, proofs[_proof].sender, proofs[_proof].state, proofs[_proof].stateChanged);
    }
    
    /** @dev Verifies a Proof
      * @param _proof String representing the Proof
      */
    function verifyProof(string _proof) 
    public isNotLocked() isOwner() isAknowledge(_proof) {
        proofs[_proof].state = State.Verified;
        emit LogProofVerified(_proof, proofs[_proof].sender, proofs[_proof].state, proofs[_proof].stateChanged);
        // At this point, a token transfer should be triggered
        emit LogProofPayout(_proof, proofs[_proof].sender, proofs[_proof].state, 20, proofs[_proof].stateChanged);
    }

    /** @dev Discards a Proof
      * @param _proof String representing the Proof
      */
    function discardProof(string _proof) 
    public isNotLocked() isOwner() isAknowledge(_proof) {
        proofs[_proof].state = State.Discarded;
        emit LogProofDiscarded(_proof, proofs[_proof].sender, proofs[_proof].state, proofs[_proof].stateChanged);
    }
    
    /** @dev Gets a Proof
      * @param _proof String representing the Proof
      */
    function getProof(string _proof) 
    public view isProof(_proof) isCreaterOrOwner(_proof)
    returns(
        uint,
        uint,
        State,
        address
    ) {
        return (
            proofs[_proof].created, 
            proofs[_proof].stateChanged, 
            proofs[_proof].state,
            proofs[_proof].sender
        );
    }
}