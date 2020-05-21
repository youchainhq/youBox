## Truffle 修改过程

### 发布 npm 流程
* 1、修改项目名称
* 2、编译成功
* 3、安装 tsc 、ttsc
* 4、指定 youchain 编译文件为 cjs
* 5、发布到 npm , organization 
* 6、修改文案说明 web3 => youchainjs 。位置 node_modules/web3-eth-accounts/src/scrypt.js ，ganache-core 依赖 

### 本地下载安装
* 1、更改 build/cli.bundled.js 的 symlink，即 修改 package.json bin: truffle => youbox
* 2、更改 Configstore 默认 config.json 文件夹为 youbox
* 3、安装成功

### 需求修改
* 1、更改依赖 web3 => youchain
* 2、更改依赖 web3-* => youchain-*
* 4、更改 Provider 类型为 any
* 5、更改 @youbox/provider/wrapper.js provider.send => provider.sendPayload
    packages/core/lib/testing/testrunner.js util.promisify(this.provider.send)(request) => this.provider.sendPayload(request);
* 6、更改单位 gwei、wei、ether => glu、lu 、you
* 7、移除 erhpm、ethpm-registry
* 8、修改 blockchain-utils
* 9、移除 hdwallet-provider
* 10、修改 test 命令。packages/core/lib/testing/testsource.js 工作路径 truffle => youbox  
* 11、修改 youbox init 默认项目路径，新增 DEMO 。packages/core/lib/commands/init.js
* 12、修改文件 truffle-config.js/truffle.js => youbox-config.js/youbox.js