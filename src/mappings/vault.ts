import {Deposit, Drawdown, Withdraw} from "../../generated/Vault/Vault";
import {VaultActivity} from "../../generated/schema";


export function handleDrawdown(event: Drawdown): void {
    let vaultActivity = VaultActivity.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
    if (!vaultActivity) {
        vaultActivity = new VaultActivity(event.transaction.hash.concatI32(event.logIndex.toI32()));
    }
    vaultActivity.transactionType = "MANAGER_DRAWDOWN";
    vaultActivity.amount = event.params.amount;
    vaultActivity.from = event.transaction.from.toHexString();
    vaultActivity.createdTimestamp = event.block.timestamp;
    vaultActivity.createdBlockNumber = event.block.number;
    vaultActivity.createdTransactionHash = event.transaction.hash.toHexString();
    vaultActivity.save();
}

export function handleDeposit(event: Deposit): void {
    let vaultActivity = VaultActivity.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
    if (!vaultActivity) {
        vaultActivity = new VaultActivity(event.transaction.hash.concatI32(event.logIndex.toI32()));
    }
    vaultActivity.transactionType = "VAULT_DEPOSIT";
    vaultActivity.amount = event.params.assets;
    vaultActivity.from = event.transaction.from.toHexString();
    vaultActivity.createdTimestamp = event.block.timestamp;
    vaultActivity.createdBlockNumber = event.block.number;
    vaultActivity.createdTransactionHash = event.transaction.hash.toHexString();
    vaultActivity.save();
}

export function handleWithdraw(event: Withdraw): void {
    let vaultActivity = VaultActivity.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
    if (!vaultActivity) {
        vaultActivity = new VaultActivity(event.transaction.hash.concatI32(event.logIndex.toI32()));
    }
    vaultActivity.transactionType = "VAULT_WITHDRAW";
    vaultActivity.amount = event.params.assets;
    vaultActivity.from = event.transaction.from.toHexString();
    vaultActivity.createdTimestamp = event.block.timestamp;
    vaultActivity.createdBlockNumber = event.block.number;
    vaultActivity.createdTransactionHash = event.transaction.hash.toHexString();
    vaultActivity.save();
}
