const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const pkg = require("./package.json");
const rootDir = path.join(__dirname, "../..");
const outputDir = path.join(__dirname, "build");

module.exports = {
  entry: {
    cli: path.join(
      __dirname,
      "../..",
      "node_modules",
      "@youbox/core",
      "cli.js"
    ),
    chain: path.join(
      __dirname,
      "../..",
      "node_modules",
      "@youbox/environment",
      "chain.js"
    ),
    analytics: path.join(
      __dirname,
      "../..",
      "node_modules",
      "@youbox/core",
      "lib",
      "services",
      "analytics",
      "main.js"
    ),
    library: path.join(
      __dirname,
      "../..",
      "node_modules",
      "@youbox/core",
      "index.js"
    )
  },
  target: "node",
  node: {
    // For this option, see here: https://github.com/webpack/webpack/issues/1599
    __dirname: false,
    __filename: false
  },
  context: rootDir,
  output: {
    path: outputDir,
    filename: "[name].bundled.js",
    library: "",
    libraryTarget: "commonjs"
  },
  devtool: "source-map",
  module: {
    rules: [
      // ignores "#!/bin..." lines inside files
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "../core"),
          path.resolve(__dirname, "../environment")
        ],
        use: "shebang-loader"
      }
    ]
  },
  externals: [
    // youbox-config uses the original-require module.
    // Here, we leave it as an external, and use the original-require
    // module that's a dependency of YOUBox instead.
    /^original-require$/,
    /^mocha$/
  ],
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      "BUNDLE_VERSION": JSON.stringify(pkg.version),
      "BUNDLE_CHAIN_FILENAME": JSON.stringify("chain.bundled.js"),
      "BUNDLE_ANALYTICS_FILENAME": JSON.stringify("analytics.bundled.js"),
      "BUNDLE_LIBRARY_FILENAME": JSON.stringify("library.bundled.js")
    }),

    // Put the shebang back on.
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node\n", raw: true }),

    // `youbox test`
    new CopyWebpackPlugin([
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "Assert.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertAddress.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertAddressArray.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertAddressPayableArray.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertBalance.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertBool.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertBytes32.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertBytes32Array.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertGeneral.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertInt.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertIntArray.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertString.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertUint.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "AssertUintArray.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "NewSafeSend.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "testing",
          "OldSafeSend.sol"
        )
      },
      {
        from: path.join(
          __dirname,
          "../..",
          "node_modules",
          "@youbox/core",
          "lib",
          "templates/"
        ),
        to: "templates",
        flatten: true
      }
    ]),

    new CleanWebpackPlugin(["build"]),

    // Make web3 1.0 packable
    new webpack.IgnorePlugin(/^electron$/)
  ],
  resolve: {
    alias: {
      "ws": path.join(__dirname, "./nil.js"),
      "bn.js": path.join(
        __dirname,
        "../..",
        "node_modules",
        "bn.js",
        "lib",
        "bn.js"
      ),
      "youchain": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain",
        "dist",
        "youchain.cjs.js"
      ),
      "youchain-core": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-core",
        "dist",
        "youchain-core.cjs.js"
      ),
      "youchain-core-helpers": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-core-helpers",
        "dist",
        "youchain-core-helpers.cjs.js"
      ),
      "youchain-core-method": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-core-method",
        "dist",
        "youchain-core-method.cjs.js"
      ),
      "youchain-core-promievent": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-core-promievent",
        "dist",
        "youchain-core-promievent.cjs.js"
      ),
      "youchain-core-subscriptions": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-core-subscriptions",
        "dist",
        "youchain-core-subscriptions.cjs.js"
      ),
      "youchain-net": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-net",
        "dist",
        "youchain-net.cjs.js"
      ),
      "youchain-providers": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-providers",
        "dist",
        "youchain-providers.cjs.js"
      ),
      "youchain-utils": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-utils",
        "dist",
        "youchain-utils.cjs.js"
      ),
      "youchain-you": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-you",
        "dist",
        "youchain-you.cjs.js"
      ),
      "youchain-you-abi": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-you-abi",
        "dist",
        "youchain-you-abi.cjs.js"
      ),
      "youchain-you-accounts": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-you-accounts",
        "dist",
        "youchain-you-accounts.cjs.js"
      ),
      "youchain-you-contract": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-you-contract",
        "dist",
        "youchain-you-contract.cjs.js"
      ),
      "youchain-you-personal": path.join(
        __dirname,
        "../..",
        "node_modules",
        "youchain-you-personal",
        "dist",
        "youchain-you-personal.cjs.js"
      ),
      "original-fs": path.join(__dirname, "./nil.js"),
      "scrypt": "js-scrypt"
    }
  },
  stats: {
    warnings: false
  }
};
