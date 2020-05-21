var command = {
  command: "init",
  description: "Initialize new and empty YOUChain project",
  builder: {},
  help: {
    usage: "youbox init [--force]",
    options: [
      {
        option: "--force",
        description:
          "Initialize project in the current directory regardless of its " +
          "state. Be careful, this\n                    will potentially overwrite files " +
          "that exist in the directory."
      }
    ]
  },
  run: function(options, done) {
    const UnboxCommand = require("./unbox");
    const fse = require("fs-extra");
    let inputPath;
    if (options._ && options._.length > 0) {
      inputPath = options._[0];
      if (!fse.existsSync(inputPath)) fse.ensureDirSync(inputPath);
    }

    // defer to `youbox unbox` command with "bare" box as arg
    const url = "https://github.com/youchainhq/youbox-bare.git";
    options._ = [url, inputPath];

    UnboxCommand.run(options, done);
  }
};

module.exports = command;
