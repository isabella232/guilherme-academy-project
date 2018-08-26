# ConsenSys Academy Final Project - August 2018

**Developer:** Guilherme Campos

**Email:** guilherme.campos@consensys.net

## Purpose of project
Internet-based volunteer computing project much like SETI@home lack an incentivization method for participants. Given that these sort of projects rely on the production of mathematical proofs by the volunteer's computers, it would be easy to track and trace who found what solution, thus being able to reward those participants

## How does it work
Each proof provided by the participants as 4 states: **Generated, Acknowledged, Verified, Discarded**. The participant sends a proof that gets storade in the smart contract, and from that moment on the platform admin can move the proof to different states. If the proof reaches a Verified state, a payout should be issued to the user (not implemented)

All proofs are stored in **IPFS**, using Infura's gateway

## How to use the project
Given the PoC nature of the project, all interactions are built in the same page. Changing accounts with Metamask will allow you to interact with the code in different ways. Account[0] is considered the platform admin account, which has power-user type of permissions. All other accounts can be considered platform user's accounts 

## How to set up ##
###### Testing ######
run `truffle test`

###### Running ######
1. run `ganache-cli`
1. run `truffle migtrate`
1. run `npm run dev`
1. load ganache-cli keys into Metamask

###### Using ######
1. Open the browser, and select a different account with Metamask - different from account[0]
1. Click **Rnd**
1. Click **Add Proof** - confirm transaction using Metamask
1. Change to account[0] - admin account
1. Press **Aknowledge** on the Proof card - confirm transaction using Metamask
1. Press either **Verify** or **Discard** on the Proof card - confirm transaction using Metamask

The project has been showing some problems when running. Sometimes the front-end, or even Metamask, won't connect correctly to ganache. I haven't figured the root cause of this, and normally the fix is to re do the steps above - make sure in run them in that order. Sometimes it also _replicates_ the same proof in the front-end.

## What's missing

#### EthNPM
At least a "Owned.sol" package could have been used for this implementation. The Lock mechanism could have also been implemented with existing packages, I imagine

#### Payout
This would be done through a specific token created for this platform. Given the scope of this project, that was not implemented.