import {UserVaultBalance, VaultActivity} from "../../generated/schema";
import {Deposit, Withdraw, Transfer} from "../../generated/templates/Vault/Vault";
import {BigInt} from "@graphprotocol/graph-ts";


export function handleDeposit(event: Deposit): void {
    let vaultActivity = VaultActivity.load(event.transaction.hash.concatI32(event.logIndex.toI32()));
    if (!vaultActivity) {
        vaultActivity = new VaultActivity(event.transaction.hash.concatI32(event.logIndex.toI32()));
    }
    vaultActivity.transactionType = "VAULT_DEPOSIT";
    vaultActivity.vaultAddress = event.address.toHexString();
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
    vaultActivity.vaultAddress = event.address.toHexString();
    vaultActivity.amount = event.params.assets;
    vaultActivity.from = event.transaction.from.toHexString();
    vaultActivity.createdTimestamp = event.block.timestamp;
    vaultActivity.createdBlockNumber = event.block.number;
    vaultActivity.createdTransactionHash = event.transaction.hash.toHexString();
    vaultActivity.save();
}

export function handleTransfer(event: Transfer): void {
    let fromBalance = UserVaultBalance.load(event.params.from.toHexString().concat(event.address.toHexString()));
    if (!fromBalance) {
        fromBalance = new UserVaultBalance(event.params.from.toHexString().concat(event.address.toHexString()));
        fromBalance.balance = new BigInt(0);
    }
    let toBalance = UserVaultBalance.load(event.params.to.toHexString().concat(event.address.toHexString()));
    if (!toBalance) {
        toBalance = new UserVaultBalance(event.params.to.toHexString().concat(event.address.toHexString()));
        toBalance.balance = new BigInt(0);
    }
    fromBalance.vaultAddress = event.address.toHexString();
    fromBalance.balance = fromBalance.balance.minus(event.params.value);
    fromBalance.investor = event.params.from.toHexString();

    toBalance.vaultAddress = event.address.toHexString();
    toBalance.balance = toBalance.balance.plus(event.params.value);
    toBalance.investor = event.params.to.toHexString();

    fromBalance.save();
    toBalance.save();
}

// export function handleTokenAdded(event: TokenAdded): void {
//     let vaultInvestment = VaultInvestment.load(event.params.chainId.toHexString().concat(event.params.tokenAddress.toHexString()));
//     if (!vaultInvestment) {
//         vaultInvestment = new VaultInvestment(event.params.chainId.toHexString().concat(event.params.tokenAddress.toHexString()));
//     }
//     vaultInvestment.tokenAddress = event.params.tokenAddress.toHexString();
//     vaultInvestment.vaultAddress = event.address.toHexString();
//     vaultInvestment.chainId = event.params.chainId;
//     vaultInvestment.save();
// }
