import { Connect, SimpleSigner } from 'uport-connect'

// export let uport = new Connect('TruffleBox')

export const uport = new Connect('Guilherme\'s Academy Project', {
  clientId: '2ofqURRPA6Nfd9oFpb3QsehTsrD7CHZgUAL',
  network: 'rinkeby',
  signer: SimpleSigner('44299cb8ab0bd65fdcd3ff0dd8936b803194219fa60e031a15c34e7a8be58275')
})

export const web3 = uport.getWeb3()
