const debug = require("debug")("provider");
const { createInterfaceAdapter } = require("@youbox/interface-adapter");
const wrapper = require("./wrapper");
const DEFAULT_NETWORK_CHECK_TIMEOUT = 5000;
const YOUChain = require("youchain");

module.exports = {
  wrap: function(provider, options) {
    return wrapper.wrap(provider, options);
  },

  create: function(options) {
    const provider = this.getProvider(options);
    return this.wrap(provider, options);
  },

  getProvider: function(options) {
    let provider;
    if (options.provider && typeof options.provider === "function") {
      provider = options.provider();
    } else if (options.provider) {
      provider = options.provider;
    } else if (options.websockets) {
      let host;
      if (options.host.substring(0, 3) === "ws") {
        if (options.port === 0) {
          host = options.host;
        } else {
          host = `${options.host}:${options.port}`;
        }
      } else {
        if (options.port === 0) {
          host = `ws://${options.host}`;
        } else {
          host = `ws://${options.host}:${options.port}`;
        }
      }
      provider = YOUChain.providers.WebsocketProvider(host);
    } else {
      let host;
      if (options.host.substring(0, 4) === "http") {
        if (options.port === 0) {
          host = options.host;
        } else {
          host = `${options.host}:${options.port}`;
        }
      } else {
        if (options.port === 0) {
          host = `http://${options.host}`;
        } else {
          host = `http://${options.host}:${options.port}`;
        }
      }
      provider = YOUChain.providers.HttpProvider(host, { keepAlive: true });
    }
    return provider;
  },

  testConnection: function(options) {
    let networkCheckTimeout, networkType;
    const { networks, network } = options;
    if (networks && networks[network]) {
      networkCheckTimeout =
        networks[network].networkCheckTimeout || DEFAULT_NETWORK_CHECK_TIMEOUT;
      networkType = networks[network].type;
    } else {
      networkCheckTimeout = DEFAULT_NETWORK_CHECK_TIMEOUT;
    }
    const provider = this.getProvider(options);
    const interfaceAdapter = createInterfaceAdapter({ provider, networkType });
    return new Promise((resolve, reject) => {
      const noResponseFromNetworkCall = setTimeout(() => {
        const errorMessage =
          "There was a timeout while attempting to connect to the network." +
          "\n       Check to see that your provider is valid.\n       If you " +
          "have a slow internet connection, try configuring a longer " +
          "timeout in your YOUBox config. Use the " +
          "networks[networkName].networkCheckTimeout property to do this.";
        throw new Error(errorMessage);
      }, networkCheckTimeout);
      interfaceAdapter
        .getBlockNumber()
        .then(() => {
          clearTimeout(noResponseFromNetworkCall);
          resolve(true);
        })
        .catch(error => {
          console.log(
            "> Something went wrong while attempting to connect " +
              "to the network. Check your network configuration."
          );
          clearTimeout(noResponseFromNetworkCall);
          reject(error);
        });
    });
  }
};
