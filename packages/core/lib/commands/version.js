const command = {
  command: "version",
  description: "Show version number and exit",
  builder: {},
  help: {
    usage: "youbox version",
    options: []
  },
  run: function(options, done) {
    let config;
    const version = require("../version");
    const { logger } = options;
    const Config = require("@youbox/config");

    try {
      config = Config.detect(options);
    } catch (error) {
      // Suppress error when youbox can't find a config
      if (error.message === "Could not find suitable configuration file.") {
        config = Config.default();
      } else {
        return done(error);
      }
    }

    version.logAll(logger, config);
    done();
  }
};

module.exports = command;
