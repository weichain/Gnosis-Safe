import {task, types} from "hardhat/config";
import {TaskArguments} from "hardhat/types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ProxyFactory } from "../../src/types";
import {TASK_CREATE_PROXY, TASK_QUERY_STORAGE} from "../helpers/constants";

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
