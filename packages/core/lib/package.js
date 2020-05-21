const expect = require("@youbox/expect");
const TruffleError = require("@youbox/error");
const Networks = require("./networks");
const YOUChain = require("youchain");
const { createInterfaceAdapter } = require("@youbox/interface-adapter");
const async = require("async");
const path = require("path");
const fs = require("fs");
const OS = require("os");

const Package = {
  install: async function(options, callback) {
    expect.options(options, ["working_directory", "ethpm"]);

    expect.options(options.ethpm, ["registry", "ipfs_host"]);

    expect.one(options.ethpm, ["provider", "install_provider_uri"]);
  },

  publish: function(options, callback) {
    var self = this;

    expect.options(options, [
      "ethpm",
      "working_directory",
      "contracts_directory",
      "networks"
    ]);

    // When publishing, you need a ropsten network configured.
    var ropsten = options.networks.ropsten;

    if (!ropsten) {
      return callback(
        new TruffleError(
          "You need to have a `ropsten` network configured in order to publish to the YOUChain Package Registry. See the following link for an example configuration:" +
            OS.EOL +
            OS.EOL +
            "    http://truffleframework.com/tutorials/using-infura-custom-provider" +
            OS.EOL
        )
      );
    }

    options.network = "ropsten";

    options.logger.log("Finding publishable artifacts...");

    self.publishable_artifacts(options, function(err, artifacts) {
      if (err) return callback(err);

      interfaceAdapter
        .getAccounts()
        .then(async accs => {
          fs.access(
            path.join(options.working_directory, "ethpm.json"),
            fs.constants.R_OK,
            function(err) {
              var manifest;

              // If the ethpm.json file doesn't exist, use the config as the manifest.
              if (err) {
                manifest = options;
              }

              options.logger.log(
                "Uploading sources and publishing to registry..."
              );
            }
          );
        })
        .catch(callback);
    });
  },

  digest: function(options, callback) {
    // async.parallel({
    //   contracts: provision.bind(provision, options, false),
    //   files: dir.files.bind(dir, options.contracts_directory)
    // }, function(err, results) {
    //   if (err) return callback(err);
    //
    //   results.contracts = results.contracts.map(function(contract) {
    //     return contract.contract_name;
    //   });
    //
    //   callback(null, results);
    // });
    callback(new Error("Not yet implemented"));
  },

  // Return a list of publishable artifacts
  publishable_artifacts: function(options, callback) {
    // Filter out "test" and "development" networks.
    var deployed_networks = Object.keys(options.networks).filter(function(
      network_name
    ) {
      return network_name !== "test" && network_name !== "development";
    });

    // Now get the URIs of each network that's been deployed to.
    Networks.asURIs(options, deployed_networks, function(err, result) {
      if (err) return callback(err);

      var uris = result.uris;

      if (result.failed.length > 0) {
        return callback(
          new Error(
            "Could not connect to the following networks: " +
              result.failed.join(", ") +
              ". These networks have deployed artifacts that can't be published as a package without an active and accessible connection. Please ensure clients for each network are up and running prior to publishing, or use the -n option to specify specific networks you'd like published."
          )
        );
      }

      var files = fs.readdirSync(options.contracts_build_directory);
      files = files.filter(file => file.includes(".json"));

      if (!files.length) {
        var msg =
          "Could not locate any publishable artifacts in " +
          options.contracts_build_directory +
          ". " +
          "Run `youbox compile` before publishing.";

        return callback(new Error(msg));
      }

      var promises = files.map(function(file) {
        return new Promise(function(accept, reject) {
          fs.readFile(
            path.join(options.contracts_build_directory, file),
            "utf8",
            function(err, body) {
              if (err) return reject(err);

              try {
                body = JSON.parse(body);
              } catch (e) {
                return reject(e);
              }

              accept(body);
            }
          );
        });
      });

      var contract_types = {};
      var deployments = {};

      Promise.all(promises)
        .then(function(contracts) {
          // contract_types first.
          contracts.forEach(function(data) {
            contract_types[data.contractName] = {
              contract_name: data.contractName,
              bytecode: data.bytecode,
              abi: data.abi
            };
          });

          //var network_cache = {};
          var matching_promises = [];

          contracts.forEach(function(data) {
            Object.keys(data.networks).forEach(function(network_id) {
              matching_promises.push(
                new Promise(function(accept, reject) {
                  // Go through each deployed network and see if this network matches.
                  // Bail early if we foun done.
                  async.each(
                    deployed_networks,
                    function(deployed_network, finished) {
                      Networks.matchesNetwork(
                        network_id,
                        options.networks[deployed_network],
                        function(err, matches) {
                          if (err) return finished(err);
                          if (matches) {
                            var uri = uris[deployed_network];

                            if (!deployments[uri]) {
                              deployments[uri] = {};
                            }

                            deployments[uri][data.contractName] = {
                              contract_type: data.contractName, // TODO: Handle conflict resolution
                              address: data.networks[network_id].address
                            };

                            return finished("bail early");
                          }
                          finished();
                        }
                      );
                    },
                    function(err) {
                      if (err && err !== "bail early") {
                        return reject(err);
                      }

                      accept();
                    }
                  );
                })
              );
            });
          });

          return Promise.all(matching_promises);
        })
        .then(function() {
          var to_return = {
            contract_types: contract_types,
            deployments: deployments
          };

          callback(null, to_return);
        })
        .catch(callback);
    });
  }
};

module.exports = Package;
