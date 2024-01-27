import {RedeemOrder as RedeemOrderEvent} from "../../generated/NoteTokenVault/NoteTokenVault";
import {RedeemOrder} from "../../generated/schema";


export function handleRedeemOrder(event: RedeemOrderEvent): void {
    let order = RedeemOrder.load(event.transaction.hash.concatI32(event.logIndex.toI32()))
    if (!order) {
        order = new RedeemOrder(event.transaction.hash.concatI32(event.logIndex.toI32()))
    }
    order.pool = event.params.pool.toHexString()
    order.noteTokenAddress = event.params.noteTokenAddress
    order.user = event.params.usr
    order.noteTokenRedeemAmount = event.params.noteTokenRedeemAmount
    order.noteTokenPrice = event.params.noteTokenPrice
    order.save()
}
