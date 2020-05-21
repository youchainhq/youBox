const { createInterfaceAdapter } = require("@youbox/interface-adapter");
const YOUChainUtils = require("youchain-utils");
const Config = require("@youbox/config");
const Migrate = require("@youbox/migrate");
const TestResolver = require("./testresolver");
const TestSource = require("./testsource");
const expect = require("@youbox/expect");
const contract = require("@youbox/contract");
const path = require("path");
const fs = require("fs-extra");
const util = require("util");
const debug = require("debug")("lib:testing:testrunner");
const Decoder = require("@youbox/decoder");
const Codec = require("@youbox/codec");

function TestRunner(options = {}) {
  expect.options(options, [
    "resolver",
    "provider",
    "contracts_build_directory"
  ]);

  this.config = Config.default().merge(options);

  this.logger = options.logger || console;
  this.initial_resolver = options.resolver;
  this.provider = options.provider;

  this.can_snapshot = false;
  this.first_snapshot = true;
  this.initial_snapshot = null;
  this.interfaceAdapter = createInterfaceAdapter({
    provider: options.provider,
    networkType: options.networks[options.network].type
  });
  this.decoder = null;

  // For each test
  this.currentTestStartBlock = null;

  this.BEFORE_TIMEOUT =
    (options.mocha && options.mocha.before_timeout) || 120000;
  this.TEST_TIMEOUT = (options.mocha && options.mocha.timeout) || 300000;
}

TestRunner.prototype.initialize = async function() {
  debug("initializing");
  let test_source = new TestSource(this.config);
  this.config.resolver = new TestResolver(
    this.initial_resolver,
    test_source,
    this.config.contracts_build_directory
  );

  if (this.first_snapshot) {
    try {
      let initial_snapshot = await this.snapshot();
      this.can_snapshot = true;
      this.initial_snapshot = initial_snapshot;
    } catch (_) {}
    this.first_snapshot = false;
  } else {
    await this.resetState();
  }

  let files = fs
    .readdirSync(this.config.contracts_build_directory)
    .filter(file => path.extname(file) === ".json");

  let data = files.map(file =>
    fs.readFileSync(
      path.join(this.config.contracts_build_directory, file),
      "utf8"
    )
  );

  let contracts = data.map(JSON.parse).map(json => contract(json));

  //NOTE: in future should get rid of contracts argument
  this.decoder = await Decoder.forProject(this.provider, contracts);
};

TestRunner.prototype.deploy = async function() {
  await Migrate.run(
    this.config.with({
      reset: true,
      quiet: true
    })
  );
};

TestRunner.prototype.resetState = async function() {
  if (this.can_snapshot) {
    await this.revert(this.initial_snapshot);
    this.initial_snapshot = await this.snapshot();
  } else {
    await this.deploy();
  }
};

TestRunner.prototype.startTest = async function() {
  let blockNumber = await this.interfaceAdapter.getBlockNumber();
  let one = YOUChainUtils.toBN(1);
  blockNumber = YOUChainUtils.toBN(blockNumber);

  // Add one in base 10
  this.currentTestStartBlock = blockNumber.add(one);
};

TestRunner.prototype.endTest = async function(mocha) {
  // Skip logging if test passes and `show-events` option is not true
  if (mocha.currentTest.state !== "failed" && !this.config["show-events"]) {
    return;
  }

  function indent(unindented, indentation, initialPrefix = "") {
    return unindented
      .split("\n")
      .map(
        (line, index) =>
          index === 0
            ? initialPrefix + " ".repeat(indentation - initialPrefix) + line
            : " ".repeat(indentation) + line
      )
      .join("\n");
  }

  function printEvent(decoding, indentation = 0, initialPrefix = "") {
    const anonymousPrefix = decoding.kind === "anonymous" ? "<anonymous> " : "";
    const className = decoding.definedIn
      ? decoding.definedIn.typeName
      : decoding.class.typeName;
    const eventName = decoding.abi.name;
    const fullEventName = anonymousPrefix + `${className}.${eventName}`;
    const eventArgs = decoding.arguments
      .map(({ name, indexed, value }) => {
        let namePrefix = name ? `${name}: ` : "";
        let indexedPrefix = indexed ? "<indexed> " : "";
        let displayValue = util.inspect(
          new Codec.Format.Utils.Inspect.ResultInspector(value),
          {
            depth: null,
            colors: true,
            maxArrayLength: null,
            breakLength: 80 - indentation //should this include prefix lengths as well?
          }
        );
        let typeString = ` (type: ${Codec.Format.Types.typeStringWithoutLocation(
          value.type
        )})`;
        return namePrefix + indexedPrefix + displayValue + typeString;
      })
      .join(",\n");
    if (decoding.arguments.length > 0) {
      return indent(
        `${fullEventName}(\n${indent(eventArgs, 2)}\n)`,
        indentation,
        initialPrefix
      );
    } else {
      return indent(`${fullEventName}()`, indentation, initialPrefix);
    }
  }

  const logs = await this.decoder.events({
    //NOTE: block numbers shouldn't be over 2^53 so this
    //should be fine, but should change this once decoder
    //accepts more general types for blocks
    fromBlock: this.currentTestStartBlock.toNumber()
  });

  if (logs.length === 0) {
    this.logger.log("    > No events were emitted");
    return;
  }

  this.logger.log("\n    Events emitted during test:");
  this.logger.log("    ---------------------------");
  this.logger.log("");

  for (const log of logs) {
    switch (log.decodings.length) {
      case 0:
        this.logger.log(`    Warning: Could not decode event!`);
        this.logger.log("");
        break;
      case 1:
        this.logger.log(printEvent(log.decodings[0], 4));
        this.logger.log("");
        break;
      default:
        this.logger.log(`    Ambiguous event, possible interpretations:`);
        for (const decoding of log.decodings) {
          this.logger.log(printEvent(decoding, 6, "    * "));
        }
        this.logger.log("");
        break;
    }
  }
  this.logger.log("\n    ---------------------------");
};

TestRunner.prototype.snapshot = async function() {
  return (await this.rpc("evm_snapshot")).result;
};

TestRunner.prototype.revert = async function(snapshot_id) {
  await this.rpc("evm_revert", [snapshot_id]);
};

TestRunner.prototype.rpc = async function(method, arg) {
  let request = {
    jsonrpc: "2.0",
    method: method,
    id: Date.now(),
    params: arg
  };

  let result = await this.provider.sendPayload(request);

  if (result.error != null) {
    throw new Error("RPC Error: " + (result.error.message || result.error));
  }
};

module.exports = TestRunner;
