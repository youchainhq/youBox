import debugModule from "debug";
const debug = debugModule("debugger:web3:adapter");

import YOUChain from "youchain";
import { promisify } from "util";

export default class Web3Adapter {
  constructor(provider) {
    this.web3 = new YOUChain(provider);
  }

  async getTrace(txHash) {
    let result = await promisify(this.web3.currentProvider.send)(
      //send *only* uses callbacks, so we use promsifiy to make things more
      //readable
      {
        jsonrpc: "2.0",
        method: "debug_traceTransaction",
        params: [txHash, {}],
        id: new Date().getTime()
      }
    );
    if (result.error) {
      throw new Error(result.error.message);
    } else {
      return result.result.structLogs;
    }
  }

  async getTransaction(txHash) {
    return await this.web3.you.getTransaction(txHash);
  }

  async getReceipt(txHash) {
    return await this.web3.you.getTransactionReceipt(txHash);
  }

  async getBlock(blockNumberOrHash) {
    return await this.web3.you.getBlock(blockNumberOrHash);
  }

  /**
   * getDeployedCode - get the deployed code for an address from the client
   * NOTE: the block argument is optional
   * @param  {String} address
   * @return {String}         deployedBinary
   */
  async getDeployedCode(address, block) {
    debug("getting deployed code for %s", address);
    let code = await this.web3.you.getCode(address, block);
    return code === "0x0" ? "0x" : code;
  }
}
