pragma solidity ^0.4.24;

contract ProofStorage {

    address owner;
    bool emergencyStop;

    enum State { Empty, Generated, Acknowledged, Verified, Discarded }
    
    event LogNewProof(string _proof, address _address, State _state, uint _timestamp);
    event LogProofAcknowledged(string _proof, address _address, State _state, uint _timestamp);
    event LogProofVerified(string _proof, address _address, State _state, uint _timestamp);
    event LogProofDiscarded(string _proof, address _address, State _state, uint _timestamp);
    event LogProofPayout(string _proof, address _address, State _state, uint _amount, uint _timestamp);

    struct Proof {
        uint created;
        uint stateChanged;
        State state;
        address sender;
    }
    
    mapping(string => Proof) proofs;

    constructor() public {
        owner = msg.sender;
    }
    
    modifier isOwner() {
        require(owner == msg.sender, "Sender address doesn't match owner");
        _;
    }
    
    modifier isCreaterOrOwner(string _proof) {
        require((proofs[_proof].sender == msg.sender) || (owner == msg.sender), "Sender address doesn't match owner or proof creator");
        _;
    }
    
    modifier isStopped() {
        require(!emergencyStop, "Contract is locked");
        _;
    }

    modifier isProof(string _proof) {
        require(proofs[_proof].state != State.Empty, "Proof doesn't exist");
        _;
    }
    
    modifier isEmpty(string _proof) {
        require(proofs[_proof].state == State.Empty, "Proof needs to be on an Empty state");
        _;
    }
    
    modifier isGenerated(string _proof) {
        require(proofs[_proof].state == State.Generated, "Proof needs to be on a Generated state");
        _;
    }
    
    modifier isAknowledge(string _proof) {
        require(proofs[_proof].state == State.Acknowledged, "Proof needs to be on an Acknowledged state");
        _;
    }
    
    function provideProof(string _proof) 
    public isEmpty(_proof) {
        proofs[_proof] = Proof(block.timestamp, block.timestamp, State.Generated, msg.sender);
        emit LogNewProof(_proof, proofs[_proof].sender, proofs[_proof].state, proofs[_proof].stateChanged);
    }
    
    function aknowledgeProof(string _proof) 
    public isOwner isGenerated(_proof) {
        proofs[_proof].state = State.Acknowledged;
        emit LogProofAcknowledged(_proof, proofs[_proof].sender, proofs[_proof].state, proofs[_proof].stateChanged);
    }
    
    function verifyProof(string _proof) 
    public isOwner isAknowledge(_proof) {
        proofs[_proof].state = State.Verified;
        emit LogProofVerified(_proof, proofs[_proof].sender, proofs[_proof].state, proofs[_proof].stateChanged);
        // At this point, a token transfer should be triggered
        emit LogProofPayout(_proof, proofs[_proof].sender, proofs[_proof].state, 20, proofs[_proof].stateChanged);
    }

    function discardProof(string _proof) 
    public isOwner isAknowledge(_proof) {
        proofs[_proof].state = State.Discarded;
        emit LogProofDiscarded(_proof, proofs[_proof].sender, proofs[_proof].state, proofs[_proof].stateChanged);
    }
    
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