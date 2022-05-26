// import { task, types } from "hardhat/config";
// import { TaskArguments } from "hardhat/types";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
// import {
// DailyLimitModule, DailyLimitModule__factory,
//   SocialRecoveryModule, SocialRecoveryModule__factory, StateChannelModule,
//   StateChannelModule__factory, WhitelistModule, WhitelistModule__factory
// } from "../../src/types";
// import {
//   SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, TASK_DEPLOY_MODULES
// } from "../helpers/constants";

// task(TASK_DEPLOY_MODULES)
//   .addOptionalParam("confirmations", "How many block confirmations to wait for", 0, types.int)
//   .addOptionalParam("printResults", "Print the addresses in the console", true, types.boolean)
//   .setAction(async function (taskArgs: TaskArguments, { ethers, run }) {
//     const signers: SignerWithAddress[] = await ethers.getSigners();
//     const admin: SignerWithAddress = signers[0];

//     // Deploys StateChannelModule
//     const stateChannelModuleFactory: StateChannelModule__factory = new StateChannelModule__factory(admin);
//     const stateChannelModule: StateChannelModule = await stateChannelModuleFactory.deploy();
//     await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
//       contract: stateChannelModule,
//       confirmations: taskArgs.confirmations,
//     });

//     // Setup StateChannelModule
//     await stateChannelModule.connect(admin).setup();
//     await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
//       contract: stateChannelModule,
//       confirmations: taskArgs.confirmations,
//     });

//     // Deploys DailyLimitModule
//     const dailyLimitModuleFactory: DailyLimitModule__factory = new DailyLimitModule__factory(admin);
//     const dailyLimitModule: DailyLimitModule = await dailyLimitModuleFactory.deploy();
//     await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
//       contract: dailyLimitModule,
//       confirmations: taskArgs.confirmations,
//     });

//     // Setup DailyLimitModule
//     await dailyLimitModule.connect(admin).setup([], []);
//     await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
//       contract: dailyLimitModule,
//       confirmations: taskArgs.confirmations,
//     });

//     // Deploys SocialRecoveryModule
//     const socialRecoveryModuleFactory: SocialRecoveryModule__factory = new SocialRecoveryModule__factory(admin);
//     const socialRecoveryModule: SocialRecoveryModule = await socialRecoveryModuleFactory.deploy();
//     await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
//       contract: socialRecoveryModule,
//       confirmations: taskArgs.confirmations,
//     });

//     const notOwnedAddress = "0x0000000000000000000000000000000000000002"
//     const notOwnedAddress2 = "0x0000000000000000000000000000000000000003"

//     // Setup SocialRecoveryModule
//     await socialRecoveryModule.connect(admin).setup([notOwnedAddress, notOwnedAddress2], 2);
//     await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
//       contract: socialRecoveryModule,
//       confirmations: taskArgs.confirmations,
//     });

//     // Deploys WhitelistModule
//     const whitelistModuleFactory: WhitelistModule__factory = new WhitelistModule__factory(admin);
//     const whitelistModule: WhitelistModule = await whitelistModuleFactory.deploy();
//     await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
//       contract: whitelistModule,
//       confirmations: taskArgs.confirmations,
//     });

//     // Setup SocialRecoveryModule
//     await whitelistModule.connect(admin).setup([]);
//     await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
//       contract: whitelistModule,
//       confirmations: taskArgs.confirmations,
//     });

//     if (taskArgs.printResults) {
//       console.table([
//         { name: "StateChannelModule", address: stateChannelModule.address},
//         { name: "DailyLimitModule", address: dailyLimitModule.address},
//         { name: "SocialRecoveryModule", address: socialRecoveryModule.address},
//         { name: "WhitelistModule", address: whitelistModule.address}
//       ]);
//     }
//   });
