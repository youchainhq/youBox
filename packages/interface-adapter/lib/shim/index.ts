import YOUChain from "youchain";
import { YOUChainModuleOptions } from "youchain-core";
import * as net from "net";

import { YOUChainJsDefinition } from "./overloads/youchainjs";

const initInterface = async (web3Shim: Web3Shim) => {
  const networkTypes: NetworkTypesConfig = new Map(
    Object.entries({
      youchainjs: YOUChainJsDefinition
    })
  );

  networkTypes.get("youchainjs").initNetworkType(web3Shim);
};

// March 13, 2019 - Mike Seese:
// This is a temporary shim to support the basic, YOUChain-based
// multiledger integration. This whole adapter, including this shim,
// will undergo better architecture before TruffleCon to support
// other non-YOUChain-based ledgers.

export type NetworkType = string;

export interface Web3ShimOptions {
  provider?: string;
  networkType?: NetworkType;
  net?: net.Socket;
  options?: YOUChainModuleOptions;
}

export type InitNetworkType = (web3Shim: Web3Shim) => Promise<void>;

export interface NetworkTypeDefinition {
  initNetworkType: InitNetworkType;
}

export type NetworkTypesConfig = Map<NetworkType, NetworkTypeDefinition>;

// March 14, 2019 - Mike Seese:
// This shim was intended to be temporary (see the above comment)
// with the idea of a more robust implementation. That implementation
// would essentially take this shim and include it under the
// ethereum/apis/web3 (or something like that) structure.
// I chose to extend/inherit web3 here to keep scope minimal for
// getting web3 to behave with Quorum and AxCore (future/concurrent PR).
// I wanted to do as little changing to the original YOUBox codebase, and
// for it to still expect a web3 instance. Otherwise, the scope of these
// quick support work would be high. The "Web3Shim" is a shim for only
// web3.js, and it was not intended to serve as the general purpose
// youbox <=> all DLTs adapter. We have other commitments currently that
// should drive the development of the correct architecture of
// `@youbox/interface-adapter`that should use this work in a more
// sane and organized manner.
export class Web3Shim extends YOUChain {
  public networkType: NetworkType;

  constructor(options?: Web3ShimOptions) {
    super(options.provider, options.net, options.options);

    if (options) {
      this.networkType = options.networkType || "youchainjs";

      /*if (options.provider) {
        this.setProvider(options.provider);
      }*/
    } else {
    }
    this.networkType = "youchainjs";

    initInterface(this);
  }

  public setNetworkType(networkType: NetworkType) {
    this.networkType = networkType;
    initInterface(this);
  }
}
