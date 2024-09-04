import {VaultActivity} from "../../generated/schema";
import {Invested} from "../../generated/Manager/Manager";


export function handleInvested(event: Invested): void {
    let vaultActivity = VaultActivity.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
    if (!vaultActivity) {
        vaultActivity = new VaultActivity(event.transaction.hash.concatI32(event.logIndex.toI32()));
    }
    vaultActivity.transactionType = "MANAGER_INVEST";
    vaultActivity.amount = event.params.amount;
    vaultActivity.from = event.transaction.from.toHexString();
    vaultActivity.createdTimestamp = event.block.timestamp;
    vaultActivity.createdBlockNumber = event.block.number;
    vaultActivity.createdTransactionHash = event.transaction.hash.toHexString();
    vaultActivity.save();
}
