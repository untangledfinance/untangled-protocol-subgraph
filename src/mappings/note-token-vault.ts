import {RedeemOrder as RedeemOrderEvent, CancelOrder as CancelOrderEvent, DisburseOrder as DisburseOrderEvent} from "../../generated/NoteTokenVault/NoteTokenVault";
import {RedeemOrder} from "../../generated/schema";
import {BigInt} from "@graphprotocol/graph-ts";


export function handleRedeemOrder(event: RedeemOrderEvent): void {
    let order = RedeemOrder.load(event.params.pool.toHexString().concat(event.params.noteTokenAddress.toHexString()).concat(event.params.usr.toHexString()))
    if (!order) {
        order = new RedeemOrder(event.params.pool.toHexString().concat(event.params.noteTokenAddress.toHexString()).concat(event.params.usr.toHexString()))
    }
    order.pool = event.params.pool.toHexString()
    order.noteTokenAddress = event.params.noteTokenAddress
    order.user = event.params.usr
    order.noteTokenRedeemAmount = event.params.noteTokenRedeemAmount
    order.noteTokenPrice = event.params.noteTokenPrice
    order.createdTimestamp = event.block.timestamp
    order.createdBlockNumber = event.block.number
    order.createdTransactionHash = event.transaction.hash.toHexString()
    order.save()
}

export function handleCancelOrder(event: CancelOrderEvent): void {
    let order = RedeemOrder.load(event.params.pool.toHexString().concat(event.params.noteTokenAddress.toHexString()).concat(event.params.usr.toHexString()))
    if (!order) {
        order = new RedeemOrder(event.params.pool.toHexString().concat(event.params.noteTokenAddress.toHexString()).concat(event.params.usr.toHexString()))
    }
    order.noteTokenRedeemAmount = BigInt.fromI32(0);
    order.noteTokenPrice = null;
    order.createdTimestamp = null;
    order.createdBlockNumber = null;
    order.createdTransactionHash = null;
    order.save()
}

export function handleDisburseOrder(event: DisburseOrderEvent): void {
    const pool = event.params.pool.toHexString();
    const noteTokenAddress = event.params.noteTokenAddress.toHexString();
    for (let i = 0; i < event.params.toAddresses.length; i++) {
        const user = event.params.toAddresses[i].toHexString();
        const redeemedAmount = event.params.redeemedAmount[i];
        let order = RedeemOrder.load(pool.concat(noteTokenAddress).concat(user))
        if (order && order.noteTokenRedeemAmount) {
            order.noteTokenRedeemAmount = order.noteTokenRedeemAmount.minus(redeemedAmount);
            order.save()
        }
    }
}
