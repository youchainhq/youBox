# @youbox/workflow-compile
Core workflow logic for the `youbox compile` command behavior

### install

```
$ npm install @youbox/workflow-compile
```

### Usage

```javascript
const Contracts = require("@youbox/workflow-compile");

// expected config object
const config = {
  contracts_directory: "/users/myPath/to/contracts", // dir where contracts are located
  contracts_build_directory: "/users/myPath/to/buildDir" // dir where contract artifacts will be saved
};

// compiles contracts found in contracts_directory,
// saves them in contracts_build_directory
Contracts.compile(config)
  .then(() => console.log("Compilation complete!"))
  .catch(e => console.error(e))
```
