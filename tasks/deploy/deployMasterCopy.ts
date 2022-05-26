// import {task, types} from "hardhat/config";
// import {TaskArguments} from "hardhat/types";
// import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
// import {GnosisSafe, GnosisSafe__factory,} from "../../src/types";
// import {SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, TASK_DEPLOY_MASTER_COPY} from "../helpers/constants";

// task(TASK_DEPLOY_MASTER_COPY)
//   .addOptionalParam("confirmations", "How many block confirmations to wait for", 0, types.int)
//   .addOptionalParam("printResults", "Print the addresses in the console", true, types.boolean)
//   .setAction(async function (taskArgs: TaskArguments, { ethers, run }) {
//     const signers: SignerWithAddress[] = await ethers.getSigners();
//     const admin: SignerWithAddress = signers[0];

//     // Deploys GnosisSafe
//     const gnosisSafeFactory: GnosisSafe__factory = new GnosisSafe__factory(admin);
//     const gnosisSafe: GnosisSafe = await gnosisSafeFactory.deploy();

//     await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
//       contract: gnosisSafe,
//       confirmations: taskArgs.confirmations,
//     });

//     if (taskArgs.printResults) {
//       console.table([
//         { name: "GnosisSafe", address: gnosisSafe.address}
//       ]);
//     }
//   });
