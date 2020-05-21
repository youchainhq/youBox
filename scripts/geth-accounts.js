/**
 * @author  cpurta <cpurta@gmail.com>
 * @github https://github.com/cpurta/geth-devnet
 * This code comes from Christopher Purta's `geth-devnet` project.
 * geth --dev seeds with a single account so we need to spin
 * up more accounts and short-circuit account auto-locking to get multi-account
 * tests passing.
 */

function createAccounts() {
  for (var i = 0; i < 10; i++) {
    acc = personal.newAccount("");
    personal.unlockAccount(acc, "");
    you.sendTransaction({
      from: you.accounts[0],
      to: acc,
      value: web3.toLu(1000, "you")
    });
  }
}

function unlockAccounts() {
  you.accounts.forEach(function(account) {
    console.log("Unlocking " + account + "...");
    personal.unlockAccount(account, "", 86400);
  });
}

function setupDevNode() {
  // keep accounts unlocked
  while (true) {
    unlockAccounts();
  }
}

createAccounts();
setupDevNode();
