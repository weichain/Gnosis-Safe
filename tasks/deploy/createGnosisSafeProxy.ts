import {task, types} from "hardhat/config";
import {TaskArguments} from "hardhat/types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ProxyFactory } from "../../src/types";
import {TASK_CREATE_PROXY, TASK_QUERY_GNOSIS_SAFE, TASK_QUERY_STORAGE} from "../helpers/constants";

task(TASK_CREATE_PROXY)
  .addOptionalParam("confirmations", "How many block confirmations to wait for", 0, types.int)
  .addOptionalParam("printResults", "Print the addresses in the console", true, types.boolean)
  .addOptionalParam("proxyFactory", "Address of the gnosisSafeProxyFactory contract", "0x29850224b772cdfcc88acf75a815ef36039fbb41")
  .addOptionalParam("masterCopy", "Address of the multiSignature(GnosisSafe) contract", "0xd4d9753a6b1e341c9020cdcc12049ace4079bf90")
  .setAction(async function (taskArgs: TaskArguments, { ethers, run }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const admin: SignerWithAddress = signers[0];

    const initializr = "0xb63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000f48f2b2d2a534e402487b3ee7c18c33aec0fe5e4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000093b45518025a21611843933087157ea8af0af4af000000000000000000000000848da5ef2f79edc669ad2bdb07dee553d5963e2c0000000000000000000000000000000000000000000000000000000000000000"
    const proxyFactory: ProxyFactory =  <ProxyFactory>(await ethers.getContractAt("ProxyFactory", taskArgs.proxyFactory));
    const tx = await proxyFactory.connect(admin).createProxy(taskArgs.masterCopy, initializr);
    const receipt = await ethers.provider.waitForTransaction(tx.hash, taskArgs.confirmations);
    let proxy;
    for (const log of receipt.logs) {
      const parsedLog = proxyFactory.interface.parseLog(log);
      if (parsedLog.name == "ProxyCreation") {
        proxy = parsedLog.args.proxy;
      }
    }

    if (taskArgs.printResults) {
      console.table([
        { name: "Proxy", address: proxy}
      ]);
    }
  });

task(TASK_QUERY_STORAGE)
  .addOptionalParam("printResults", "Print the addresses in the console", true, types.boolean)
  .addOptionalParam("contract", "Name of the contract")
  .addOptionalParam("address", "Address of the contract")
  .addOptionalParam("storageElements", "Num of storage elements", 10, types.int)
  .setAction(async function (taskArgs: TaskArguments, { ethers, run }) {
    const storage = [];
    for (let i = 0; i < taskArgs.storageElements; i++) {
      const element = await ethers.provider.getStorageAt(taskArgs.address, i);
      storage.push(element);
    }

    if (taskArgs.printResults) {
      console.table(storage);
    }
  });

task(TASK_QUERY_GNOSIS_SAFE)
  .addOptionalParam("printResults", "Print the addresses in the console", true, types.boolean)
  .addOptionalParam("contract", "Name of the contract")
  .addOptionalParam("address", "Address of the contract", "0x2Fecdb8aeE80Df5E5d45960CB3Ee3aF4aB0f173B")
  .setAction(async function (taskArgs: TaskArguments, { ethers, run }) {

    // The first storage slot always refers to the address internal masterCopy, which is the address of the deployed GnosisSafe
    const element0 = await ethers.provider.getStorageAt(taskArgs.address, 0);

    // Then it is ModuleManager if not set just sets the default sentinel modules
    const modulesMappingIndex = ethers.utils.solidityKeccak256(["uint256", "uint256"], ["0x0000000000000000000000000000000000000001", 1])
    const sentinelModule = await ethers.provider.getStorageAt(taskArgs.address, modulesMappingIndex);

    // Then we have the owners
    const owner1Address = "0x93b45518025a21611843933087157eA8AF0Af4aF";
    const owner2Address = "0x848dA5Ef2f79edc669ad2bdB07DeE553d5963e2c";
    const owner1Index = ethers.utils.solidityKeccak256(["uint256", "uint256"], [owner1Address, 2]);
    const owner2Index =  ethers.utils.solidityKeccak256(["uint256", "uint256"], [owner2Address, 2]);
    const owner1 = await ethers.provider.getStorageAt(taskArgs.address, owner1Index);
    const owner2 = await ethers.provider.getStorageAt(taskArgs.address, owner2Index);

    // Then the owner count
    const element3 = await ethers.provider.getStorageAt(taskArgs.address, 3);

    // Then the threshold
    const element4 = await ethers.provider.getStorageAt(taskArgs.address, 4);

    // Then the FALLBACK_HANDLER_STORAGE_SLOT
    const slot = "0x6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d5"
    const fallbackHandler = await ethers.provider.getStorageAt(taskArgs.address, slot);

    // Then the nonce, which is changed when a transaction is executed
    const element5 = await ethers.provider.getStorageAt(taskArgs.address, 5);

    // Then the domain separator
    const element6 = await ethers.provider.getStorageAt(taskArgs.address, 6);

    if (taskArgs.printResults) {
      console.table([
        { name: "masterCopy", position: 0, value: element0 },
        { name: "ownerCount", position: 3, value: element3 },
        { name: "threshold", position: 4, value: element4 },
        { name: "nonce", position: 5, value: element5 },
        { name: "domainSeparator", position: 6, value: element6 },
        { name: "sentinelModule", position: modulesMappingIndex, value: sentinelModule },
        { name: "owner1", position: owner1Index, value: owner1 },
        { name: "owner2", position: owner2Index, value: owner2 },
        { name: "fallbackHandler", position: slot, value: fallbackHandler },
      ]);
    }
  });

task("query:proxy-factory")
  .addOptionalParam("printResults", "Print the addresses in the console", true, types.boolean)
  .addOptionalParam("proxyFactory", "Address of the contract", "0x29850224b772cdfcc88acf75a815ef36039fbb41")
  .setAction(async function (taskArgs: TaskArguments, { ethers, run }) {

    const factory = <ProxyFactory>(await ethers.getContractAt("ProxyFactory", taskArgs.proxyFactory));
    const creationCode = await factory.proxyCreationCode();
    const runtimeCode = await factory.proxyRuntimeCode();

    if (taskArgs.printResults) {
      console.table([
        { name: "creationCode", value: creationCode },
        { name: "runtimeCode", value: runtimeCode }
      ]);
    }
  });
