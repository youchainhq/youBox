const debug = require("debug")("contract:contract"); // eslint-disable-line no-unused-vars
let YOUChain = require("youchain");
const webUtils = require("web3-utils");
const execute = require("../execute");
const bootstrap = require("./bootstrap");
const constructorMethods = require("./constructorMethods");
const properties = require("./properties");

// For browserified version. If browserify gave us an empty version,
// look for the one provided by the user.
if (typeof YOUChain === "object" && Object.keys(YOUChain).length === 0) {
  YOUChain = global.YOUChain;
}

(function(module) {
  // Accepts a contract object created with web3.you.Contract or an address.
  function Contract(contract) {
    var instance = this;
    var constructor = instance.constructor;

    // Disambiguate between .at() and .new()
    if (typeof contract === "string") {
      var web3Instance = new constructor.web3.you.Contract(constructor.abi);
      web3Instance.options.address = contract;
      contract = web3Instance;
    }

    // Core:
    instance.methods = {};
    instance.abi = constructor.abi;
    instance.address = contract.options.address;
    instance.transactionHash = contract.transactionHash;
    instance.contract = contract;

    // User defined methods, overloaded methods, events
    instance.abi.forEach(function(item) {
      switch (item.type) {
        case "function":
          var isConstant =
            ["pure", "view"].includes(item.stateMutability) || item.constant; // new form // deprecated case

          var signature = webUtils._jsonInterfaceMethodToString(item);

          var method = function(constant, web3Method) {
            var fn;

            constant
              ? (fn = execute.call.call(
                  constructor,
                  web3Method,
                  item,
                  instance.address
                ))
              : (fn = execute.send.call(
                  constructor,
                  web3Method,
                  item,
                  instance.address
                ));

            fn.call = execute.call.call(
              constructor,
              web3Method,
              item,
              instance.address
            );
            fn.sendTransaction = execute.send.call(
              constructor,
              web3Method,
              item,
              instance.address
            );
            fn.estimateGas = execute.estimate.call(
              constructor,
              web3Method,
              item,
              instance.address
            );
            fn.request = execute.request.call(
              constructor,
              web3Method,
              item,
              instance.address
            );

            return fn;
          };

          // Only define methods once. Any overloaded methods will have all their
          // accessors available by ABI signature available on the `methods` key below.
          if (instance[item.name] === undefined) {
            instance[item.name] = method(
              isConstant,
              contract.methods[item.name]
            );
          }

          // Overloaded methods should be invoked via the .methods property
          instance.methods[signature] = method(
            isConstant,
            contract.methods[signature]
          );
          break;

        case "event":
          instance[item.name] = execute.event.call(
            constructor,
            contract.events[item.name]
          );
          break;
      }
    });

    // sendTransaction / send
    instance.sendTransaction = execute.send.call(
      constructor,
      null,
      null,
      instance.address
    );

    // Prefer user defined `send`
    if (!instance.send) {
      instance.send = (value, txParams = {}) => {
        const packet = Object.assign({ value: value }, txParams);
        return instance.sendTransaction(packet);
      };
    }

    // Other events
    instance.allEvents = execute.allEvents.call(constructor, contract);
    instance.getPastEvents = execute.getPastEvents.call(constructor, contract);
  }

  Contract._constructorMethods = constructorMethods(Contract);

  // Getter functions are scoped to Contract object.
  Contract._properties = properties;

  bootstrap(Contract);
  module.exports = Contract;

  return Contract;
})(module || {});
