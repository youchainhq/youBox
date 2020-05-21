var command = {
  command: "opcode",
  description: "Print the compiled opcodes for a given contract",
  builder: {
    all: {
      type: "boolean",
      default: false
    }
  },
  help: {
    usage: "youbox opcode <contract_name>",
    options: [
      {
        option: "<contract_name>",
        description:
          "Name of the contract to print opcodes for. Must be a contract name, not a file name. (required)"
      }
    ]
  },
  run: function(options, done) {
    var Config = require("@youbox/config");
    var TruffleError = require("@youbox/error");
    var Contracts = require("@youbox/workflow-compile");
    var CodeUtils = require("@youbox/code-utils");

    if (options._.length === 0) {
      return done(new TruffleError("Please specify a contract name."));
    }

    var config = Config.detect(options);
    Contracts.compile(config, function(err) {
      if (err) return done(err);

      var contractName = options._[0];
      var Contract;
      try {
        Contract = config.resolver.require(contractName);
      } catch (e) {
        return done(
          new TruffleError(
            'Cannot find compiled contract with name "' + contractName + '"'
          )
        );
      }

      var bytecode = Contract.deployedBytecode;
      var numInstructions = Contract.deployedSourceMap.split(";").length;

      if (options.creation) {
        bytecode = Contract.bytecode;
        numInstructions = Contract.sourceMap.split(";").length;
      }

      var opcodes = CodeUtils.parseCode(bytecode, numInstructions);

      var indexLength = (opcodes.length + "").length;

      opcodes.forEach(function(opcode, index) {
        var strIndex = index + ":";

        while (strIndex.length < indexLength + 1) {
          strIndex += " ";
        }

        console.log(
          strIndex + " " + opcode.name + " " + (opcode.pushData || "")
        );
      });
    });
  }
};

module.exports = command;
