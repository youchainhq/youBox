import _ from "lodash";
import * as path from "path";
import Provider from "@youbox/provider";
import TruffleConfig from "./";

export const getInitialConfig = ({
  truffleDirectory,
  workingDirectory,
  network
}: {
  truffleDirectory?: string;
  workingDirectory?: string;
  network?: string;
}) => {
  const truffle_directory =
    truffleDirectory || path.resolve(path.join(__dirname, "../"));
  const working_directory = workingDirectory || process.cwd();

  return {
    truffle_directory,
    working_directory,
    network,
    networks: {},
    verboseRpc: false,
    gas: null,
    gasPrice: null,
    from: null,
    confirmations: 0,
    timeoutBlocks: 0,
    production: false,
    skipDryRun: false,
    build: null,
    resolver: null,
    artifactor: null,
    compilers: {
      solc: {
        settings: {
          optimizer: {
            enabled: false,
            runs: 200
          },
          remappings: []
        }
      },
      vyper: {}
    },
    logger: {
      log() {}
    }
  };
};

export const configProps = ({
  configObject
}: {
  configObject: TruffleConfig;
}) => {
  const resolveDirectory = (value: string): string =>
    path.resolve(configObject.working_directory, value);

  const defaultTXValues = {
    gas: 6721975,
    gasPrice: 1000000000, // 1 glu,
    from: null
  };

  return {
    // These are already set.
    truffle_directory() {},
    working_directory() {},
    network() {},
    networks() {},
    verboseRpc() {},
    build() {},
    resolver() {},
    artifactor() {},
    ethpm() {},
    logger() {},
    compilers() {},
    ens() {},

    build_directory: {
      default: () => path.join(configObject.working_directory, "build"),
      transform: resolveDirectory
    },
    contracts_directory: {
      default: () => path.join(configObject.working_directory, "contracts"),
      transform: resolveDirectory
    },
    contracts_build_directory: {
      default: () => path.join(configObject.build_directory, "contracts"),
      transform: resolveDirectory
    },
    migrations_directory: {
      default: () => path.join(configObject.working_directory, "migrations"),
      transform: resolveDirectory
    },
    migrations_file_extension_regexp() {
      return /^\.(js|es6?)$/;
    },
    test_directory: {
      default: () => path.join(configObject.working_directory, "test"),
      transform: resolveDirectory
    },
    test_file_extension_regexp() {
      return /.*\.(js|ts|es|es6|jsx|sol)$/;
    },
    example_project_directory: {
      default: () => path.join(configObject.truffle_directory, "example"),
      transform: resolveDirectory
    },
    network_id: {
      get() {
        try {
          return configObject.network_config.network_id;
        } catch (e) {
          return null;
        }
      },
      set() {
        throw new Error(
          "Do not set config.network_id. Instead, set config.networks and then config.networks[<network name>].network_id"
        );
      }
    },
    network_config: {
      get() {
        const network = configObject.network;

        if (network === null || network === undefined) {
          throw new Error("Network not set. Cannot determine network to use.");
        }

        let config = configObject.networks[network];

        if (config === null || config === undefined) {
          config = {};
        }

        config = _.extend({}, defaultTXValues, config);

        return config;
      },
      set() {
        throw new Error(
          "Don't set config.network_config. Instead, set config.networks with the desired values."
        );
      }
    },
    from: {
      get() {
        try {
          return configObject.network_config.from;
        } catch (e) {
          return defaultTXValues.from;
        }
      },
      set() {
        throw new Error(
          "Don't set config.from directly. Instead, set config.networks and then config.networks[<network name>].from"
        );
      }
    },
    gas: {
      get() {
        try {
          return configObject.network_config.gas;
        } catch (e) {
          return defaultTXValues.gas;
        }
      },
      set() {
        throw new Error(
          "Don't set config.gas directly. Instead, set config.networks and then config.networks[<network name>].gas"
        );
      }
    },
    gasPrice: {
      get() {
        try {
          return configObject.network_config.gasPrice;
        } catch (e) {
          return defaultTXValues.gasPrice;
        }
      },
      set() {
        throw new Error(
          "Don't set config.gasPrice directly. Instead, set config.networks and then config.networks[<network name>].gasPrice"
        );
      }
    },
    provider: {
      get() {
        if (!configObject.network) {
          return null;
        }

        const options = configObject.network_config;
        options.verboseRpc = configObject.verboseRpc;

        return Provider.create(options);
      },
      set() {
        throw new Error(
          "Don't set config.provider directly. Instead, set config.networks and then set config.networks[<network name>].provider"
        );
      }
    },
    confirmations: {
      get() {
        try {
          return configObject.network_config.confirmations;
        } catch (e) {
          return 0;
        }
      },
      set() {
        throw new Error(
          "Don't set config.confirmations directly. Instead, set config.networks and then config.networks[<network name>].confirmations"
        );
      }
    },
    production: {
      get() {
        try {
          return configObject.network_config.production;
        } catch (e) {
          return false;
        }
      },
      set() {
        throw new Error(
          "Don't set config.production directly. Instead, set config.networks and then config.networks[<network name>].production"
        );
      }
    },
    timeoutBlocks: {
      get() {
        try {
          return configObject.network_config.timeoutBlocks;
        } catch (e) {
          return 0;
        }
      },
      set() {
        throw new Error(
          "Don't set config.timeoutBlocks directly. Instead, set config.networks and then config.networks[<network name>].timeoutBlocks"
        );
      }
    }
  };
};
