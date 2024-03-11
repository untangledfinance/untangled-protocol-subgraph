import {DrawdownAsset as DrawdownAssetEvent, AssetRepay as AssetRepayEvent } from "../../generated/LoanKernel/LoanKernel";
import {DrawdownAsset, AssetRepay } from "../../generated/schema";
import {BigInt} from "@graphprotocol/graph-ts";


export function handleDrawdownAsset(event: DrawdownAssetEvent): void {
    let drawdown = DrawdownAsset.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
    if (!drawdown) {
        drawdown = new DrawdownAsset(event.transaction.hash.concatI32(event.logIndex.toI32()));
    }
    drawdown.pool = event.params._poolAddress.toHexString();
    drawdown.drawdownAmount = event.params._drawdownAmount;
    drawdown.createdTimestamp = event.block.timestamp;
    drawdown.createdBlockNumber = event.block.number;
    drawdown.createdTransactionHash = event.transaction.hash.toHexString();
    drawdown.save();
}

export function handleAssetRepay(event: AssetRepayEvent): void {
    let assetRepay = AssetRepay.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
    if (!assetRepay) {
        assetRepay = new AssetRepay(event.transaction.hash.concatI32(event.logIndex.toI32()));
    }
    assetRepay.pool = event.params._pool.toHexString();
    assetRepay.payer = event.params._payer.toHexString();
    assetRepay.amount = event.params._amount;
    assetRepay.outstandingAmount = event.params._outstandingAmount;
    assetRepay.token = event.params._token;
    assetRepay.agreementId = event.params._agreementId;
    assetRepay.createdTimestamp = event.block.timestamp;
    assetRepay.createdBlockNumber = event.block.number;
    assetRepay.createdTransactionHash = event.transaction.hash.toHexString();
    assetRepay.save();
}
