import { Address, BigInt, ethereum, log } from '@graphprotocol/graph-ts';
import { clearStore, test, describe, beforeAll, assert } from 'matchstick-as/assembly/index';
import { createNoteTokenPurchasedEvent} from './utils'
import {handleNoteTokenPurchased} from '../src/mappings/securitization-manager'
import {
  NoteTokenPurchased,
  PoolDetail,
  UserInvestment, 
  UserPoolInvestment,
} from "../generated/schema"


test('Can call mappings with custom events', () => {

  let poolDetail = new PoolDetail("0x0000000000000000000000000000000000000001");
  poolDetail.createdBlockNumber = new BigInt(1);
  poolDetail.sotAddress = "0x0000000000000000000000000000000000000010";
  poolDetail.tgeSOTAddress = "0x0000000000000000000000000000000000000011";
  poolDetail.totalSOTAmount = new BigInt(0);
  poolDetail.jotAddress = "0x0000000000000000000000000000000000000020";
  poolDetail.tgeJOTAddress = "0x0000000000000000000000000000000000000021";
  poolDetail.totalJOTAmount = new BigInt(0);
  poolDetail.save();

  // let sm = new SecuritizationManager('smId0');
  // sm.save();

  // Create mock events
  const event = createNoteTokenPurchasedEvent(
    "0x000000000000000000000000000000000000000E", 
    "0x0000000000000000000000000000000000000011", 
    "0x0000000000000000000000000000000000000001", 
    BigInt.fromI64(1000000000000000000), BigInt.fromI64(1000000000000000000),
  );
  // log.info('{}', [event.params.tgeAddress.toHexString()]);

  // Call mapping functions passing the events we just created
  handleNoteTokenPurchased(event);
  // let isSOT = poolDetail.tgeSOTAddress == event.params.tgeAddress.toHexString()
  let userPoolInvestment = UserPoolInvestment.load(event.params.investor.toHexString().concat(event.params.poolAddress.toHexString()))
  let tgeSOTAddress: string = "";
  let tgeAddress: string = "";
  if (poolDetail.tgeSOTAddress) {
    tgeSOTAddress = poolDetail.tgeSOTAddress!
  }
  tgeAddress = event.params.tgeAddress.toHexString();
  let isSOT = tgeSOTAddress == tgeAddress;
  log.info(typeof tgeSOTAddress,[])
  log.info(typeof tgeAddress,[])

  log.info(`isSot ${isSOT.toString()}, tgeSOTAddress ${tgeSOTAddress}, event.params.tgeAddress ${tgeAddress}`, [ ]);
  // assert.equals(ethereum.Value.fromBoolean(true), ethereum.Value.fromBoolean(isSOT));
  // !!userPoolInvestment && !!(userPoolInvestment.totalSOTAmount) && log.info('alsdkfl', [userPoolInvestment.totalSOTAmount.toString()]);
  // clearStore();
});

