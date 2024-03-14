import { log } from "matchstick-as";
import {
  JotDeployed as JotDeployedEvent,
  NewPoolCreated as NewPoolCreatedEvent,
  SotDeployed as SotDeployedEvent,
  NoteTokenPurchased as NoteTokenPurchasedEvent} from "../../generated/SecuritizationManager/SecuritizationManager"
import {
  NoteTokenPurchased, PoolActivity,
  PoolDetail,
  UserInvestment,
  UserPoolInvestment,
} from "../../generated/schema"
import { BigInt } from '@graphprotocol/graph-ts';



export function handleJotDeployed(event: JotDeployedEvent): void {
  let pool = PoolDetail.load(event.params.poolAddress.toHexString())
  if (!pool) {
    pool = new PoolDetail(event.params.poolAddress.toHexString())
    pool.totalJOTAmount = new BigInt(0)
    pool.totalSOTAmount = new BigInt(0)
  }
  pool.jotAddress = event.params.jotAddress.toHexString()
  pool.tgeJOTAddress = event.params.tgeAddress.toHexString()
  pool.save()
}

export function handleSotDeployed(event: SotDeployedEvent): void {
  let pool = PoolDetail.load(event.params.poolAddress.toHexString())
  if (!pool) {
    pool = new PoolDetail(event.params.poolAddress.toHexString())
    pool.totalJOTAmount = new BigInt(0)
    pool.totalSOTAmount = new BigInt(0)
  }
  pool.sotAddress = event.params.sotAddress.toHexString()
  pool.tgeSOTAddress = event.params.tgeAddress.toHexString()
  pool.save()
}

export function handleNewPoolCreated(event: NewPoolCreatedEvent): void {
  let pool = PoolDetail.load(event.params.instanceAddress.toHexString())
  if (!pool) {
    pool = new PoolDetail(event.params.instanceAddress.toHexString())
    pool.totalJOTAmount = new BigInt(0)
    pool.totalSOTAmount = new BigInt(0)
  }
  pool.createdBlockNumber = event.block.number
  pool.createdTimestamp = event.block.timestamp
  pool.createdTransactionHash = event.transaction.hash.toHexString()
  pool.save()
}

export function handleNoteTokenPurchased(event: NoteTokenPurchasedEvent): void {
  let poolDetail = PoolDetail.load(event.params.poolAddress.toHexString())
  if (!poolDetail) {
    return
  }
  let isSOT = poolDetail.tgeSOTAddress == event.params.tgeAddress.toHexString()
  // FIXME: remove this when use clean contract and handle from block create contract
  if (!poolDetail.totalJOTAmount) {
    poolDetail.totalJOTAmount = new BigInt(0)
  }
  if (!poolDetail.totalSOTAmount) {
    poolDetail.totalSOTAmount = new BigInt(0)
  }
  // ///////////////////////////

  if (isSOT) {
    poolDetail.totalSOTAmount = poolDetail.totalSOTAmount.plus(event.params.tokenAmount)
  } else {
    poolDetail.totalJOTAmount = poolDetail.totalJOTAmount.plus(event.params.tokenAmount)
  }
  poolDetail.save()

  let tokenPurchased = NoteTokenPurchased.load(event.transaction.hash.concatI32(event.logIndex.toI32()))
  if (!tokenPurchased) {
   tokenPurchased = new NoteTokenPurchased(event.transaction.hash.concatI32(event.logIndex.toI32()))
  }
  tokenPurchased.investor = event.params.investor
  tokenPurchased.tgeAddress = event.params.tgeAddress
  tokenPurchased.pool = event.params.poolAddress.toHexString()
  tokenPurchased.amount = event.params.amount
  tokenPurchased.tokenAmount = event.params.tokenAmount

  tokenPurchased.blockNumber = event.block.number
  tokenPurchased.blockTimestamp = event.block.timestamp
  tokenPurchased.transactionHash = event.transaction.hash
  tokenPurchased.save()

  // Create pool activity
  let poolActivity = PoolActivity.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
  if (!poolActivity) {
    poolActivity = new PoolActivity(event.transaction.hash.concatI32(event.logIndex.toI32()));
  }
  poolActivity.pool = event.params.poolAddress.toHexString();
  poolActivity.transactionType = isSOT ? "SOT_PURCHASE" : "JOT_PURCHASE";
  poolActivity.amount = event.params.amount;
  poolActivity.from = event.transaction.from.toHexString();
  poolActivity.createdTimestamp = event.block.timestamp;
  poolActivity.createdBlockNumber = event.block.number;
  poolActivity.createdTransactionHash = event.transaction.hash.toHexString();
  poolActivity.save();

  let userInvestment = UserInvestment.load(event.params.investor.toHexString())
  if (!userInvestment) {
    userInvestment = new UserInvestment(event.params.investor.toHexString())
    userInvestment.save()
  }

  let userPoolInvestment = UserPoolInvestment.load(event.params.investor.toHexString().concat(event.params.poolAddress.toHexString()))
  if (!userPoolInvestment) {
    userPoolInvestment = new UserPoolInvestment(event.params.investor.toHexString().concat(event.params.poolAddress.toHexString()))
    userPoolInvestment.totalJOTAmount = new BigInt(0)
    userPoolInvestment.totalSOTAmount = new BigInt(0)
  }
  if (isSOT) {
    userPoolInvestment.totalSOTAmount = userPoolInvestment.totalSOTAmount.plus(event.params.tokenAmount)
  } else {
    userPoolInvestment.totalJOTAmount = userPoolInvestment.totalJOTAmount.plus(event.params.tokenAmount)
  }
  userPoolInvestment.investor = event.params.investor.toHexString()
  userPoolInvestment.pool = event.params.poolAddress.toHexString()
  userPoolInvestment.save()
}
