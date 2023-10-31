import {
  Address,
  ethereum,
  JSONValue,
  Value,
  ipfs,
  json,
  Bytes,
} from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/index';

import { SecuritizationManager } from '../generated/schema';
import { NewPoolCreated } from '../generated/SecuritizationManager/SecuritizationManager';

export function createNewPoolEvent(instanceAddress: string): NewPoolCreated {
  let newEvent = changetype<NewPoolCreated>(newMockEvent());
  newEvent.parameters = new Array();

  let addressParam = new ethereum.EventParam(
    'instanceAddress',
    ethereum.Value.fromAddress(Address.fromString(instanceAddress))
  );

  newEvent.parameters.push(addressParam);

  return newEvent;
}
