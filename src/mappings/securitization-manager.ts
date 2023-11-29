import {
  JotDeployed as JotDeployedEvent,
  NewPoolCreated as NewPoolCreatedEvent,
  SotDeployed as SotDeployedEvent,
  NoteTokenPurchased as NoteTokenPurchasedEvent} from "../../generated/SecuritizationManager/SecuritizationManager"
import {
  NoteTokenPurchased,
  PoolDetail
} from "../../generated/schema"


export function handleJotDeployed(event: JotDeployedEvent): void {
  let pool = PoolDetail.load(event.params.poolAddress.toHexString())
  if (!pool) {
    pool = new PoolDetail(event.params.poolAddress.toHexString())
  }
  pool.jotAddress = event.params.jotAddress.toHexString()
  pool.tgeJOTAddress = event.params.tgeAddress.toHexString()
  pool.save()
}

export function handleSotDeployed(event: SotDeployedEvent): void {
  let pool = PoolDetail.load(event.params.poolAddress.toHexString())
  if (!pool) {
    pool = new PoolDetail(event.params.poolAddress.toHexString())
  }
  pool.sotAddress = event.params.sotAddress.toHexString()
  pool.tgeSOTAddress = event.params.tgeAddress.toHexString()
  pool.save()
}

export function handleNewPoolCreated(event: NewPoolCreatedEvent): void {
  let pool = PoolDetail.load(event.params.instanceAddress.toHexString())
  if (!pool) {
    pool = new PoolDetail(event.params.instanceAddress.toHexString())
  }  
  pool.createdBlockNumber = event.block.number
  pool.createdTimestamp = event.block.timestamp
  pool.createdTransactionHash = event.transaction.hash.toHexString()
  pool.save()
}  

export function handleNoteTokenPurchased(event: NoteTokenPurchasedEvent): void {
  let tokenPurchased = NoteTokenPurchased.load(event.transaction.hash.concatI32(event.logIndex.toI32()))
  if (!tokenPurchased) {
   tokenPurchased = new NoteTokenPurchased(event.transaction.hash.concatI32(event.logIndex.toI32()))
  }
  tokenPurchased.investor = event.params.investor
  tokenPurchased.tgeAddress = event.params.tgeAddress
  tokenPurchased.poolAddress = event.params.poolAddress
  tokenPurchased.amount = event.params.amount
  tokenPurchased.tokenAmount = event.params.tokenAmount

  tokenPurchased.blockNumber = event.block.number
  tokenPurchased.blockTimestamp = event.block.timestamp
  tokenPurchased.transactionHash = event.transaction.hash
  tokenPurchased.poolDetail = event.params.poolAddress.toHexString()
  tokenPurchased.save()
}