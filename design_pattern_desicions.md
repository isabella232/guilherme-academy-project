# Design Pattern Decision

Given the very linear nature of the process replicated in this smart contract, the State machine pattern was chosen. It limits the interactions with the smart contract, with a very clear set of steps and I/O's.

The flow is as follows:
1. All virtually existing Proofs have an initial **Empty** state (they exist in the mapping)
1. When a Proof is submitted, the Proof moves into a **Generated** state - this step is done by the participant, and it's the only one the participant can do
1. The platform admin then sees the proof was created, and moves it into an **Aknowledge** state
1. The Proof is then verified, again by the Admin - these are the 2 possible final states:
    1. If it is an actual Proof, it moves into the **Verified** state, and a payout is submitted to the user that provided the Proof
    1. If it is not a Proof, then it moves into the **Discarded** state