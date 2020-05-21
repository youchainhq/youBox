const assert = require("assert");

describe("YOUBox Library APIs [ @standalone ]", () => {
  // Avoid `npm test:raw`
  if (process.env.NO_BUILD) return;

  let youbox;
  before(function() {
    this.timeout(10000);
    youbox = require("../../../build/library.bundled.js");
  });

  it("youbox.build API definition", () => {
    assert(youbox.build, "build undefined");
    assert(youbox.build.clean, "build.clean undefined");
    assert(youbox.build.build, "build.build undefined");
  });

  it("youbox.create API definition", () => {
    assert(youbox.create, "create undefined");
    assert(youbox.create.contract, "create.contract undefined");
    assert(youbox.create.test, "create.test undefined");
    assert(youbox.create.migration, "create.migration undefined");
  });

  it("youbox.console API definition", () => {
    // This one returns a constructor.
    assert(youbox.console, "console undefined");
  });

  it("youbox.contracts API definition", () => {
    assert(youbox.contracts.compile, "contracts.compile undefined");
    assert(
      youbox.contracts.collectCompilations,
      "contracts.collectCompilations undefined"
    );
    assert(
      youbox.contracts.compileSources,
      "contracts.compileSources undefined"
    );
    assert(
      youbox.contracts.reportCompilationStarted,
      "contracts.reportCompilationStarted undefined"
    );
    assert(
      youbox.contracts.reportCompilationFinished,
      "contracts.reportCompilationFinished undefined"
    );
    assert(
      youbox.contracts.reportNothingToCompile,
      "contracts.reportNothingToCompile undefined"
    );
    assert(
      youbox.contracts.writeContracts,
      "contracts.writeContracts undefined"
    );
  });

  it("youbox.package API definition", () => {
    assert(youbox.package.publish, "package.publish undefined");
    assert(youbox.package.install, "package.install undefined");
    assert(youbox.package.digest, "package.digest undefined");
    assert(
      youbox.package.publishable_artifacts,
      "package.publishable_artifacts undefined"
    );
  });

  it("youbox.test API", () => {
    assert(youbox.test.run, "test.run undefined");
    assert(youbox.test.createMocha, "test.createMocha undefined");
    assert(youbox.test.getAccounts, "test.getAccounts undefined");
    assert(
      youbox.test.compileContractsWithTestFilesIfNeeded,
      "test.withTestFiles undefined"
    );
    assert(
      youbox.test.performInitialDeploy,
      "test.performInitialDeploy undefined"
    );
    assert(
      youbox.test.defineSolidityTests,
      "test.defineSolidityTests undefined"
    );
    assert(youbox.test.setJSTestGlobals, "test.setJSTestGlobals undefined");
  });

  it("youbox.version API", () => {
    assert(youbox.version, "youbox.version undefined");
  });

  it("youbox.ganache", () => {
    assert(youbox.ganache, "ganache undefined");
    assert(youbox.ganache.provider, "ganache.provider undefined");
    assert(youbox.ganache.server, "ganache.server undefined");
  });
});
