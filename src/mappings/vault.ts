import {VaultActivity} from "../../generated/schema";
import {Deposit, Withdraw} from "../../generated/templates/Vault/Vault";


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
