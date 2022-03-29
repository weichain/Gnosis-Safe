import { task, types } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Timelock, Timelock__factory } from "../../src/types";
import {
  SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS,
  TASK_DEPLOY_TIMELOCK
} from "../helpers/constants";

task(TASK_DEPLOY_TIMELOCK)
  .addOptionalParam("confirmations", "How many block confirmations to wait for", 0, types.int)
  .addOptionalParam("printResults", "Print the addresses in the console", true, types.boolean)
  .addOptionalParam("admin", "Address of the multiSignature(GnosisSafe) contract")
  .addOptionalParam("delay", "Delay in seconds")
  .setAction(async function (taskArgs: TaskArguments, { ethers, run }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const admin: SignerWithAddress = signers[0];

    // Deploys GnosisSafe
    const timelockFactory: Timelock__factory = new Timelock__factory(admin);
    const timelock: Timelock = await timelockFactory.deploy(taskArgs.admin, taskArgs.delay);

    await run(SUBTASK_DEPLOY_WAIT_FOR_CONFIRMATIONS, {
      contract: timelock,
      confirmations: taskArgs.confirmations,
    });

    if (taskArgs.printResults) {
      console.table([
        { name: "Timelock", address: timelock.address, admin: taskArgs.admin, delay: taskArgs.delay}
      ]);
    }
  });
