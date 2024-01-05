import {
  Address,
  ethereum,
  BigInt,
} from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/index';


import {
  NewPoolCreated as NewPoolCreatedEvent,
  NoteTokenPurchased as NoteTokenPurchasedEvent} from "../generated/SecuritizationManager/SecuritizationManager"

export function createNewPoolEvent(instanceAddress: string): NewPoolCreatedEvent {
  let newEvent = changetype<NewPoolCreatedEvent>(newMockEvent());
  newEvent.parameters = new Array();

  let addressParam = new ethereum.EventParam(
    'instanceAddress',
    ethereum.Value.fromAddress(Address.fromString(instanceAddress))
  );

  newEvent.parameters.push(addressParam);

  return newEvent;
}

export function createNoteTokenPurchasedEvent(investor: string, tgeAddress: string, poolAddress: string, amount: BigInt, tokenAmount: BigInt): NoteTokenPurchasedEvent {
  let newEvent = changetype<NoteTokenPurchasedEvent>(newMockEvent());
  
  let investorParam = new ethereum.EventParam(
    'investor',
    ethereum.Value.fromAddress(Address.fromString(investor))
  );

  let tgeAddressParam = new ethereum.EventParam(
    'tgeAddress',
    ethereum.Value.fromAddress(Address.fromString(tgeAddress))
  );

  let poolAddressParam = new ethereum.EventParam(
    'poolAddress',
    ethereum.Value.fromAddress(Address.fromString(poolAddress))
  );
    
  let amountParam = new ethereum.EventParam(
    'amount',
    ethereum.Value.fromUnsignedBigInt(amount)
  );
    
  let tokenAmountParam = new ethereum.EventParam(
    'tokenAmount',
    ethereum.Value.fromUnsignedBigInt(tokenAmount)
  );
    
  newEvent.parameters = [investorParam, tgeAddressParam, poolAddressParam, amountParam, tokenAmountParam];

  return newEvent;
}
