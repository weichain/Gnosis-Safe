// import { task, types } from "hardhat/config";
// import { TaskArguments } from "hardhat/types";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
// import {
//   CreateAndAddModules,
//   CreateAndAddModules__factory, MultiSend, MultiSend__factory
// } from "../../src/types";
// import {
//   SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS,
//   TASK_DEPLOY_LIBRARIES
// } from "../helpers/constants";

// task(TASK_DEPLOY_LIBRARIES)
//   .addOptionalParam("confirmations", "How many block confirmations to wait for", 0, types.int)
//   .addOptionalParam("printResults", "Print the addresses in the console", true, types.boolean)
//   .setAction(async function (taskArgs: TaskArguments, { ethers, run }) {
//     const signers: SignerWithAddress[] = await ethers.getSigners();
//     const admin: SignerWithAddress = signers[0];

//     // Deploys CreateAndAddModules
//     const createAndAddModulesFactory: CreateAndAddModules__factory = new CreateAndAddModules__factory(admin);
//     const createAndAddModules: CreateAndAddModules = await createAndAddModulesFactory.deploy();

//     await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
//       contract: createAndAddModules,
//       confirmations: taskArgs.confirmations,
//     });

//     // Deploys MultiSend
//     const multiSendFactory: MultiSend__factory = new MultiSend__factory(admin);
//     const multiSend: MultiSend = await multiSendFactory.deploy();

//     await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
//       contract: multiSend,
//       confirmations: taskArgs.confirmations,
//     });

//     if (taskArgs.printResults) {
//       console.table([
//         { name: "CreateAndAddModules", address: createAndAddModules.address},
//         { name: "MultiSend", address: multiSend.address}
//       ]);
//     }
//   });
