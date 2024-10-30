import {NewVaultCreated} from "../../generated/VaultFactory/VaultFactory";
import {Vault as VaultTemplate} from "../../generated/templates";

export function handleNewVaultCreated(event: NewVaultCreated): void {
    VaultTemplate.create(event.params.vaultAddress)
}
