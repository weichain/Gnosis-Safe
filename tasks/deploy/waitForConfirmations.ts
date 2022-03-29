import { subtask, types } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

subtask("deploy:wait-for-confirmations")
  .addParam("confirmations", "How many block confirmations to wait for", 0, types.int)
  .addParam("contract", "Contract whose deployment to wait for", undefined, types.any)
  .setAction(async function (taskArgs: TaskArguments): Promise<void> {
    if (taskArgs.confirmations === 0) {
      await taskArgs.contract.deployed();
    } else if (taskArgs.contract.deployTransaction) {
      await taskArgs.contract.deployTransaction.wait(taskArgs.confirmations);
    }
  });
