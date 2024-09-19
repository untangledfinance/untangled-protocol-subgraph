import {Deposit, Withdraw, TokenAdded} from "../../generated/Vault/Vault";
import {UserPoolInvestment, VaultActivity, VaultInvestment} from "../../generated/schema";
import {BigInt} from "@graphprotocol/graph-ts";


export function handleDeposit(event: Deposit): void {
    let vaultActivity = VaultActivity.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
    if (!vaultActivity) {
        vaultActivity = new VaultActivity(event.transaction.hash.concatI32(event.logIndex.toI32()));
    }
    vaultActivity.transactionType = "VAULT_DEPOSIT";
    vaultActivity.amount = event.params.assets;
    vaultActivity.from = event.transaction.from.toHexString();
    vaultActivity.createdTimestamp = event.block.timestamp;
    vaultActivity.createdBlockNumber = event.block.number;
    vaultActivity.createdTransactionHash = event.transaction.hash.toHexString();
    vaultActivity.save();
}

export function handleWithdraw(event: Withdraw): void {
    let vaultActivity = VaultActivity.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
    if (!vaultActivity) {
        vaultActivity = new VaultActivity(event.transaction.hash.concatI32(event.logIndex.toI32()));
    }
    vaultActivity.transactionType = "VAULT_WITHDRAW";
    vaultActivity.amount = event.params.assets;
    vaultActivity.from = event.transaction.from.toHexString();
    vaultActivity.createdTimestamp = event.block.timestamp;
    vaultActivity.createdBlockNumber = event.block.number;
    vaultActivity.createdTransactionHash = event.transaction.hash.toHexString();
    vaultActivity.save();
}

export function handleTokenAdded(event: TokenAdded): void {
    let vaultInvestment = VaultInvestment.load(event.params.chainId.toHexString().concat(event.params.tokenAddress.toHexString()));
    if (!vaultInvestment) {
        vaultInvestment = new VaultInvestment(event.params.chainId.toHexString().concat(event.params.tokenAddress.toHexString()));
    }
    vaultInvestment.tokenAddress = event.params.tokenAddress.toHexString();
    vaultInvestment.chainId = event.params.chainId;
    vaultInvestment.save();
}
