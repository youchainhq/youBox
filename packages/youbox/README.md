

YOUBox is a development environment, testing framework and asset pipeline for YOUChain, aiming to make life as an YOUChain developer easier. With YOUBox, you get:

* Built-in smart contract compilation, linking, deployment and binary management.
* Automated contract testing with Mocha and Chai.
* Configurable build pipeline with support for custom build processes.
* Scriptable deployment & migrations framework.
* Network management for deploying to many public & private networks.
* Interactive console for direct contract communication.
* Instant rebuilding of assets during development.
* External script runner that executes scripts within a YOUBox environment.

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

YOUBox comes bundled with a local development blockchain server that launches automatically when you invoke the commands  above. If you'd like to [configure a more advanced development environment](http://truffleframework.com/docs/advanced/configuration) we recommend you install the blockchain server separately by running `npm install -g ganache-cli` at the command line.

+  [ganache-cli](https://github.com/trufflesuite/ganache-cli): a command-line version of YOUBox's blockchain server.
+  [ganache](http://truffleframework.com/ganache/): A GUI for the server that displays your transaction history and chain state.


### Documentation

Please see the [Official YOUBox Documentation](http://truffleframework.com/docs/) for guides, tips, and examples.

### Contributing

This package is a distribution package of the YOUBox command line tool. Please see [@youbox/core](https://github.com/trufflesuite/truffle/tree/develop/packages/core) to contribute to the main core code.

### License

MIT
