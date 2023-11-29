import {
  AdminChanged as AdminChangedEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  Upgraded as UpgradedEvent,
  Initialized as InitializedEvent,
  JotDeployed as JotDeployedEvent,
  NewNotesTokenCreated as NewNotesTokenCreatedEvent,
  NewPoolCreated as NewPoolCreatedEvent,
  NewTGECreated as NewTGECreatedEvent,
  Paused as PausedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  SotDeployed as SotDeployedEvent,
  TokensPurchased as TokensPurchasedEvent,
  Unpaused as UnpausedEvent,
  UpdateAllowedUIDTypes as UpdateAllowedUIDTypesEvent,
  UpdatePotToPool as UpdatePotToPoolEvent
} from "../../generated/SecuritizationManager/SecuritizationManager"
import {
  JotDeployed,
  NewNotesTokenCreated,
  NewPoolCreated,
  NewTGECreated,
  Paused,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  SotDeployed,
  TokensPurchased,
  Unpaused,
  UpdateAllowedUIDTypes,
  UpdatePotToPool,
  PoolDetail
} from "../../generated/schema"

import {
MintedNormalTGE as MintedNormalTGEContract
} from "../../generated/SecuritizationManager/MintedNormalTGE"

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

export function handleTokensPurchased(event: TokensPurchasedEvent): void {
  let tokensPurchased = new TokensPurchased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  tokensPurchased.investor = event.params.investor
  tokensPurchased.tgeAddress = event.params.tgeAddress
  tokensPurchased.amount = event.params.amount
  tokensPurchased.tokenAmount = event.params.tokenAmount

  tokensPurchased.blockNumber = event.block.number
  tokensPurchased.blockTimestamp = event.block.timestamp
  tokensPurchased.transactionHash = event.transaction.hash

  tokensPurchased.save()
  
  let tgeContract = MintedNormalTGEContract.bind(event.params.tgeAddress)
  const poolAddress = tgeContract.pool()
  let pool = PoolDetail.load(poolAddress.toHexString())
  if (!pool) {
    pool = new PoolDetail(poolAddress.toHexString())
  }
  let poolTokensPurchased = pool.tokensPurchased
  if (!poolTokensPurchased) {
    poolTokensPurchased = []
  }
  poolTokensPurchased.push(tokensPurchased.id)
  pool.save()
}