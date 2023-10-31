import { Address, log } from '@graphprotocol/graph-ts';
import { NewPoolCreated } from '../../generated/SecuritizationManager/SecuritizationManager';

export function handlePoolCreated(event: NewPoolCreated): void {
  log.info(`handlePoolCreated {}`, [
    event.params.instanceAddress.toHexString(),
  ]);
}
