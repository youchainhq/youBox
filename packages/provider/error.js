const { inherits } = require("util");
const TruffleError = require("@youbox/error");

// HACK: string comparison seems to be only way to identify being unable to
// connect to RPC node.
const NOT_CONNECTED_MESSAGE = 'Invalid JSON RPC response: ""';

function ProviderError(message, options) {
  if (message === NOT_CONNECTED_MESSAGE) {
    message = buildMessage(options);
  }
  ProviderError.super_.call(this, message);
  this.message = message;
}

inherits(ProviderError, TruffleError);

const buildMessage = options => {
  const { host, port, network_id } = options;
  let message;
  if (host) {
    message =
      "\nCould not connect to your YOUChain client with the following parameters:\n" +
      `    - host       > ${host}\n` +
      `    - port       > ${port}\n` +
      `    - network_id > ${network_id}\n`;
  } else {
    message = "\nCould not connect to your YOUChain client.\n";
  }

  message +=
    "Please check that your YOUChain client:\n" +
    "    - is running\n" +
    '    - is accepting RPC connections (i.e., "--rpc" option is used in geth)\n' +
    "    - is accessible over the network\n" +
    "    - is properly configured in your YOUBox configuration file (youbox-config.js)\n";
  return message;
};

module.exports = ProviderError;
