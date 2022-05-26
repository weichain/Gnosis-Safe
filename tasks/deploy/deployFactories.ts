// import { task, types } from "hardhat/config";
// import { TaskArguments } from "hardhat/types";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
// import {
//   ProxyFactory,
//   ProxyFactory__factory
// } from "../../src/types";
// import { SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, TASK_DEPLOY_FACTORIES } from "../helpers/constants";

// task(TASK_DEPLOY_FACTORIES)
//   .addOptionalParam("confirmations", "How many block confirmations to wait for", 0, types.int)
//   .addOptionalParam("printResults", "Print the addresses in the console", true, types.boolean)
//   .setAction(async function (taskArgs: TaskArguments, { ethers, run }) {
//     const signers: SignerWithAddress[] = await ethers.getSigners();
//     const admin: SignerWithAddress = signers[0];

//     // Deploys ProxyFactory
//     const proxyFactoryFactory: ProxyFactory__factory = new ProxyFactory__factory(admin);
//     const proxyFactory: ProxyFactory = await proxyFactoryFactory.deploy();

//     await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
//       contract: proxyFactory,
//       confirmations: taskArgs.confirmations,
//     });

//     if (taskArgs.printResults) {
//       console.table([
//         { name: "ProxyFactory", address: proxyFactory.address}
//       ]);
//     }
//   });
