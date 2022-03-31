# Solidity Template

My favorite setup for writing Solidity smart contracts.

- [Hardhat](https://github.com/nomiclabs/hardhat): compile and run the smart contracts on a local development network
- [TypeChain](https://github.com/ethereum-ts/TypeChain): generate TypeScript types for smart contracts
- [Ethers](https://github.com/ethers-io/ethers.js/): renowned Ethereum library and wallet implementation
- [Waffle](https://github.com/EthWorks/Waffle): tooling for writing comprehensive smart contract tests
- [Solhint](https://github.com/protofire/solhint): linter
- [Solcover](https://github.com/sc-forks/solidity-coverage): code coverage
- [Prettier Plugin Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity): code formatter

This is a GitHub template, which means you can reuse it as many times as you want. You can do that by clicking the "Use this
template" button at the top of the page.

## Usage

### Pre Requisites

Before running any command, you need to create a `.env` file and set a BIP-39 compatible mnemonic as an environment
variable. Follow the example in `.env.example`. If you don't already have a mnemonic, use this [website](https://iancoleman.io/bip39/) to generate one.

Then, proceed with installing dependencies:

```sh
yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```sh
$ yarn typechain
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Test

Run the Mocha tests:

```sh
$ yarn test
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
$ REPORT_GAS=true yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

## Syntax Highlighting

If you use VSCode, you can enjoy syntax highlighting for your Solidity code via the
[vscode-solidity](https://github.com/juanfranblanco/vscode-solidity) extension. The recommended approach to set the
compiler version is to add the following fields to your VSCode user settings:

```json
{
  "solidity.compileUsingRemoteVersion": "v0.8.13+commit.abaa5c0e",
  "solidity.defaultCompiler": "remote"
}
```

Where `v0.8.13+commit.abaa5c0e` can be replaced with your version of choice.

### Deploy

Deploy the factories:

```sh
$ yarn hardhat --network "..." deploy:factories
```

Deploy the libraries:

```sh
$ yarn hardhat --network "..." deploy:libraries
```

Deploy master copy:

```sh
$ yarn hardhat --network "..." deploy:master-copy
```

Deploy modules:

```sh
$ yarn hardhat --network "..." deploy:modules
```

Deploy timelock:

```sh
$ yarn hardhat --network "..." deploy:timelock --admin "0x..." --delay "..."
```

Create proxy:

```sh
$ yarn hardhat --network "..." create:proxy --proxy-factory "0x..." --master-copy "0x..."
```

Query storage:

```sh
$ yarn hardhat --network "..." query:storage --contract "..." --address "0x..." --storage-elements "..."
```

Other options:

```sh
--printResults    Prints resulting addresses to the console. Default value is true.
--confirmations   Number of block confirmations to wait after deployment of each contract. Default is 0.
```

### Gnosis Safe overview
Gnosis Safe contracts are a set of upgradable smart contracts. The core logic contract(https://github.com/weichain/Gnosis-Safe/blob/main/contracts/version-1.1.1/GnosisSafe.sol)
which will be referred as mastercopy is deployed only once, and new proxies are created through the ProxyFactory contract.

#### Deployment procedure
1. Deploy the ProxyFactory contract(https://github.com/weichain/Gnosis-Safe/blob/main/contracts/version-1.1.1/proxies/ProxyFactory.sol).
The proxy factory provides a simple way to create a new proxy contract pointing to a mastercopy
and executing a function in the newly deployed proxy all in one transaction. This additional transaction is generally used to execute the setup function to initialize the state of the contract.
2. Deploy the masterCopy(https://github.com/weichain/Gnosis-Safe/blob/main/contracts/version-1.1.1/GnosisSafe.sol). This contract contains all core functionality required to set up a Gnosis Safe and to execute transactions.
Events are emitted for every successful as well as every failed transaction.

#### Creating a new Safe
The Gnosis Safe smart contract was written with the usage of proxy contract in mind.
Because of that there is no constructor and it is required to call an initialize function on the contract before it can be used. For this it is recommended to use the ProxyFactory.
For proxy creation call the createProxy function(https://github.com/weichain/Gnosis-Safe/blob/main/contracts/version-1.1.1/proxies/ProxyFactory.sol#L14),
by passing the address of the deployed masterCopy and encoding the function call with the passed parameters of the setup function inside the masterCopy(https://github.com/weichain/Gnosis-Safe/blob/main/contracts/version-1.1.1/GnosisSafe.sol).
To get the ABI-encoded output you can use: https://abi.hashex.org/.
An example of calling the createProxy function is the following:
```sh
function createProxy(address masterCopy, bytes memory data)
masterCopy = address of the deployed mastercopy (https://github.com/weichain/Gnosis-Safe/blob/main/contracts/version-1.1.1/GnosisSafe.sol)
data = encoded function call to the setup function(https://github.com/weichain/Gnosis-Safe/blob/main/contracts/version-1.1.1/GnosisSafe.sol)
```
The required params to set inside the setup function are: `onwers` and `threshold`. Other parameters are there for additional functionality of setting modules, payments and fallbackHandler.
If you wish to set the fallbackHandler first deploy the https://github.com/weichain/Gnosis-Safe/blob/main/contracts/version-1.1.1/handler/DefaultCallbackHandler.sol and pass the address.
The createProxy function emits an event `ProxyCreation(proxy)` whereby the `proxy` is the address of the newly deployed safe.

### Timelock overview
Timelock is a single contract(https://github.com/weichain/Gnosis-Safe/blob/main/contracts/version-1.1.1/timelock/Timelock.sol) and it queues and executes proposals by the admin of the contract which was set during the construction phase.
In our particular case the admin will be the address of the safe we created in the step described above.
```sh
constructor(address admin_, uint delay_) public {
  admin_ = address of the created safe
  delay_ = delay for execution of scheduled transactions in seconds
}
```

It is possible to change the values for `GRACE_PERIOD`, `MINIMUM_DELAY` and `MAXIMUM_DELAY` directly inside solidity
but then requires the compilation and re-deployment of the contract so make sure to choose those values correctly.

