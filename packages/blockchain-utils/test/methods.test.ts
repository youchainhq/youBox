import BlockchainUtils from "../";
import assert from "assert";
import { describe, it } from "mocha";

describe("BlockchainUtils.parse", () => {
  it("returns empty parsed object if uri doesn't start with blockchain://", () => {
    const parsed = BlockchainUtils.parse("notBlockchain://");
    assert.deepEqual(parsed, {});
  });
  it("BlockchainUtils.asURI ", function() {
    let networks = {};
    const BlockchainUtils = require("@youbox/blockchain-utils");
    const Provider = require("@youbox/provider");
    const provider = Provider.create(networks);
    BlockchainUtils.asURI(provider, (err: any, uri: any) => {
      console.log("greason BlockchainUtils", uri, err);
    });
  });
});
