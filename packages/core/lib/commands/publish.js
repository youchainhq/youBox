var command = {
  command: "publish",
  description: "Publish a package to the YOUChain Package Registry",
  builder: {},
  help: {
    usage: "youbox publish",
    options: []
  },
  run: function(options, done) {
    var Config = require("@youbox/config");
    var Package = require("../package");

    var config = Config.detect(options);
    Package.publish(config, done);
  }
};

module.exports = command;
