import {
    AssetRepay as AssetRepayEvent,
    DrawdownAsset as DrawdownAssetEvent
} from "../../generated/LoanKernel/LoanKernel";
import {PoolActivity} from "../../generated/schema";


export function handleDrawdownAsset(event: DrawdownAssetEvent): void {
    let poolActivity = PoolActivity.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
    if (!poolActivity) {
        poolActivity = new PoolActivity(event.transaction.hash.concatI32(event.logIndex.toI32()));
    }
    poolActivity.pool = event.params._poolAddress.toHexString();
    poolActivity.transactionType = "DRAWDOWN";
    poolActivity.amount = event.params._drawdownAmount;
    poolActivity.createdTimestamp = event.block.timestamp;
    poolActivity.createdBlockNumber = event.block.number;
    poolActivity.createdTransactionHash = event.transaction.hash.toHexString();
    poolActivity.save();
}

export function handleAssetRepay(event: AssetRepayEvent): void {
    let poolActivity = PoolActivity.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
    if (!poolActivity) {
        poolActivity = new PoolActivity(event.transaction.hash.concatI32(event.logIndex.toI32()));
    }
    poolActivity.pool = event.params._pool.toHexString();
    poolActivity.transactionType = "REPAY";
    poolActivity.amount = event.params._amount;
    poolActivity.createdTimestamp = event.block.timestamp;
    poolActivity.createdBlockNumber = event.block.number;
    poolActivity.createdTransactionHash = event.transaction.hash.toHexString();
    poolActivity.save();
}
