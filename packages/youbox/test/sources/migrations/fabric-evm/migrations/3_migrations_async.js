const YOUChain = require("youchain");

const Example = artifacts.require("Example");
const IsLibrary = artifacts.require("IsLibrary");
const UsesExample = artifacts.require("UsesExample");
const UsesLibrary = artifacts.require("UsesLibrary");
const PayableExample = artifacts.require("PayableExample");

module.exports = async function(deployer) {
  await deployer.deploy(Example);
  await deployer.deploy(Example, { overwrite: false });

  await deployer.deploy(IsLibrary);
  await deployer.link(IsLibrary, UsesLibrary);
  await deployer.deploy(UsesExample, IsLibrary.address);
  await deployer.deploy(UsesLibrary);

  await deployer.deploy(PayableExample, {
    value: YOUChain.utils.toLu("1", "you")
  });
};
