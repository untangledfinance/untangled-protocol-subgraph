import {
  Initialized as InitializedEvent,
  NewNotesTokenCreated as NewNotesTokenCreatedEvent,
  NewPoolCreated as NewPoolCreatedEvent,
  NewTGECreated as NewTGECreatedEvent,
  Paused as PausedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  TokensPurchased as TokensPurchasedEvent,
  Unpaused as UnpausedEvent
} from "../../generated/SecuritizationManager/SecuritizationManager"
import {
  Initialized,
  NewNotesTokenCreated,
  NewPoolCreated,
  NewTGECreated,
  Paused,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  TokensPurchased,
  Unpaused
} from "../../generated/schema"

export function handleNewNotesTokenCreated(
  event: NewNotesTokenCreatedEvent
): void {
  let entity = new NewNotesTokenCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.instanceAddress = event.params.instanceAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewPoolCreated(event: NewPoolCreatedEvent): void {
  let entity = new NewPoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.instanceAddress = event.params.instanceAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewTGECreated(event: NewTGECreatedEvent): void {
  let entity = new NewTGECreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.instanceAddress = event.params.instanceAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensPurchased(event: TokensPurchasedEvent): void {
  let entity = new TokensPurchased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.investor = event.params.investor
  entity.tgeAddress = event.params.tgeAddress
  entity.amount = event.params.amount
  entity.tokenAmount = event.params.tokenAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
