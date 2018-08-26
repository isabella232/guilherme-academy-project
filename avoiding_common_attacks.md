# Avoiding Common Attacks

### Race conditions
The payout was not implement in this project, but could be one possible vector of attack. A way to avoid this would be to do the payout in a separate step, outside of the ProofStorage smart contract, but that would then increase risk of malicious admin not paying users, and also reduce automation of the process

