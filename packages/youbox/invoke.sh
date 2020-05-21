#!/usr/bin/env bash

cd ../../
sed -i "" "s/web3/youchain/g" "./node_modules/web3-eth-accounts/src/scrypt.js"