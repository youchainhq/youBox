import { Web3Shim } from "../../shim";
import { InterfaceAdapter, EvmBlockType, Transaction } from "../types";

export interface Web3InterfaceAdapterOptions {
  provider?: string;
  networkType?: string;
}

export class Web3InterfaceAdapter implements InterfaceAdapter {
  public youchain: Web3Shim;

  constructor({ provider, networkType }: Web3InterfaceAdapterOptions = {}) {
    this.youchain = new Web3Shim({ provider, networkType });
  }

  public getNetworkId() {
    return this.youchain.you.net.getId();
  }

  public getBlock(block: EvmBlockType) {
    return this.youchain.you.getBlock(block);
  }

  public getTransaction(tx: string) {
    return this.youchain.you.getTransaction(tx);
  }

  public getTransactionReceipt(tx: string) {
    return this.youchain.you.getTransactionReceipt(tx);
  }

  public getBalance(address: string) {
    return this.youchain.you.getBalance(address);
  }

  public getCode(address: string) {
    return this.youchain.you.getCode(address);
  }

  public getAccounts() {
    return this.youchain.you.getAccounts();
  }

  public estimateGas(transactionConfig: Transaction) {
    return this.youchain.you.estimateGas(transactionConfig);
  }

  public getBlockNumber() {
    return this.youchain.you.getBlockNumber();
  }
}
