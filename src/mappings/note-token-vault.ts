import {RedeemOrder as RedeemOrderEvent, CancelOrder as CancelOrderEvent, DisburseOrder as DisburseOrderEvent} from "../../generated/NoteTokenVault/NoteTokenVault";
import {PoolActivity, PoolDetail, RedeemOrder, UserPoolInvestment} from "../../generated/schema";
import {BigInt} from "@graphprotocol/graph-ts";
import { log } from '@graphprotocol/graph-ts';


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
    log.info("TAN_1", []);

    let poolDetail = PoolDetail.load(pool);

    // Load PoolActivity
    let poolActivity = PoolActivity.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
    if (!poolActivity) {
        poolActivity = new PoolActivity(event.transaction.hash.concatI32(event.logIndex.toI32()));
    }
    log.info("TAN_2", []);
    let totalCurrencyAmount = BigInt.fromI32(0);

    for (let i = 0; i < event.params.toAddresses.length; i++) {
        log.info("TAN_3", []);
        const user = event.params.toAddresses[i].toHexString();
        const redeemedAmount = event.params.redeemedAmount[i];
        const currencyAmount = event.params.amounts[i];
        let order = RedeemOrder.load(pool.concat(noteTokenAddress).concat(user))
        if (order && order.noteTokenRedeemAmount) {
            log.info("TAN_4", []);
            order.noteTokenRedeemAmount = order.noteTokenRedeemAmount.minus(redeemedAmount);
            order.save()
        }
        totalCurrencyAmount = totalCurrencyAmount.plus(currencyAmount);

        // Update pool totalSOTAmount & totalJOTAmount
        if (poolDetail) {
            log.info("TAN_5", []);
            let isSOT = poolDetail.sotAddress == noteTokenAddress;
            if (isSOT) {
                log.info("TAN_6", []);
                poolDetail.totalSOTAmount = poolDetail.totalSOTAmount.minus(redeemedAmount);
            } else {
                log.info("TAN_7", []);
                poolDetail.totalJOTAmount = poolDetail.totalJOTAmount.minus(redeemedAmount);
            }

            let userPoolInvestment = UserPoolInvestment.load(user.concat(pool))
            if (userPoolInvestment) {
                log.info("TAN_8", []);
                if (isSOT) {
                    log.info("TAN_9", []);
                    userPoolInvestment.totalSOTAmount = userPoolInvestment.totalSOTAmount.minus(redeemedAmount);
                } else {
                    log.info("TAN_10", []);
                    userPoolInvestment.totalJOTAmount = userPoolInvestment.totalJOTAmount.minus(redeemedAmount);
                }
                log.info("TAN_11", []);
                userPoolInvestment.save();
            }
        }

    }

    if (poolDetail) {
        log.info("TAN_12", []);
        poolDetail.save();
    }

    log.info("TAN_13", []);
    // Save PoolActivity
    poolActivity.amount = totalCurrencyAmount;
    poolActivity.pool = pool;
    poolActivity.transactionType = "EPOCH_WITHDRAW";
    poolActivity.from = event.transaction.from.toHexString();
    poolActivity.createdTimestamp = event.block.timestamp;
    poolActivity.createdBlockNumber = event.block.number;
    poolActivity.createdTransactionHash = event.transaction.hash.toHexString();
    poolActivity.save();
    log.info("TAN_14", []);


}
