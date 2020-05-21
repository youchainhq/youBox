#!/usr/bin/env bash

chmod 777 ./build/cli.bundled.js
chmod 777 ./build/analytics.bundled.js
chmod 777 ./build/library.bundled.js
chmod 777 ./build/chain.bundled.js
cp -r ./build /usr/local/lib/node_modules/youbox/