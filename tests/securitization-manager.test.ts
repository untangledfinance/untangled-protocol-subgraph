import { clearStore, test, describe } from 'matchstick-as/assembly/index';
import { log } from 'matchstick-as/assembly/log';

import { SecuritizationManager } from '../generated/schema';
import { NewPoolCreated } from '../generated/SecuritizationManager/SecuritizationManager';
import { handlePoolCreated } from '../src/mappings/securitization-manager';
import { createNewPoolEvent } from './utils';

describe('Mock contract functions', () => {
  test('Can call mappings with custom events', () => {
    // let sm = new SecuritizationManager('smId0');
    // sm.save();

    // Create mock events
    const newPoolCreateedEvent = createNewPoolEvent(
      '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
    );

    log.info('{}', [newPoolCreateedEvent.params.instanceAddress.toHexString()]);

    // Call mapping functions passing the events we just created
    handlePoolCreated(newPoolCreateedEvent);

    // clearStore();
  });

  test('Next test', () => {
    //...
  });
});
