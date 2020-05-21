
YOUBox is a development environment, testing framework and asset pipeline for YOUChain, aiming to make life as an YOUChain developer easier. With YOUBox, you get:

* Built-in smart contract compilation, linking, deployment and binary management.
* Automated contract testing with Mocha and Chai.
* Configurable build pipeline with support for custom build processes.
* Scriptable deployment & migrations framework.
* Network management for deploying to many public & private networks.
* Interactive console for direct contract communication.
* Instant rebuilding of assets during development.
* External script runner that executes scripts within a YOUBox environment.

| ℹ️ **Contributors**: Please see the [Development](#development) section of this README. |
| --- |

### Install

```
$ npm install -g youbox
```

### Quick Usage

For a default set of contracts and tests, run the following within an empty project directory:

```
$ youbox init
```

From there, you can run `youbox compile`, `youbox migrate` and `youbox test` to compile your contracts, deploy those contracts to the network, and run their associated unit tests.

YOUBox comes bundled with a local development blockchain server that launches automatically when you invoke the commands  above. If you'd like to [configure a more advanced development environment](https://truffleframework.com/docs/advanced/configuration) we recommend you install the blockchain server separately by running `npm install -g ganache-cli` at the command line.

+  [ganache-cli](https://github.com/trufflesuite/ganache-cli): a command-line version of YOUBox's blockchain server.
+  [ganache](https://truffleframework.com/ganache/): A GUI for the server that displays your transaction history and chain state.


### Documentation

Please see the [Official YOUBox Documentation](https://truffleframework.com/docs/) for guides, tips, and examples.

### Development

We welcome pull requests. To get started, just fork this repo, clone it locally, and run:

```shell
# Install
npm install -g yarn
yarn bootstrap

# Test
yarn test

# Adding dependencies to a package
cd packages/<youbox-package>
yarn add <npm-package> [--dev] # Use yarn
```

If you'd like to update a dependency to the same version across all packages, you might find [this utility](https://www.npmjs.com/package/lerna-update-wizard) helpful.

*Notes on project branches:*
+    `master`: Stable, released version (v5)
+    `beta`: Released beta version
+    `develop`: Work targeting stable release (v5)
+    `next`: Upcoming feature development and most new work

Please make pull requests against `next` for any substantial changes. Small changes and bugfixes can be considered for `develop`.

There is a bit more information in the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

### License

MIT
