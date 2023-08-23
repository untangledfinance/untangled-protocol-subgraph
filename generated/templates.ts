// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  Address,
  DataSourceTemplate,
  DataSourceContext
} from "@graphprotocol/graph-ts";

export class TranchedPool extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("TranchedPool", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "TranchedPool",
      [address.toHex()],
      context
    );
  }
}

export class CallableLoan extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("CallableLoan", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "CallableLoan",
      [address.toHex()],
      context
    );
  }
}
