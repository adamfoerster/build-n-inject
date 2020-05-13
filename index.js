const child_process = require("child_process");
const fs = require("fs");
const state = {
  branch: null,
  config: null,
};

function main(state) {
  console.log("Loading config file");
  loadConfig(state);
  console.log("Asserting branch");
  getBranch(state);
  console.log("Building");
  build(state);
  console.log("all done");
}

function loadConfig(state) {
  if (!fs.existsSync("./build-n-inject.config.json")) {
    throw "build-n-inject.config.json file not found!";
  }
  state.config = JSON.parse(
    fs.readFileSync("build-n-inject.config.json", "utf8")
  );
}

function getBranch(state) {
  child_process.execSync("git status > .bni-status");
  const stdout = fs.readFileSync(".bni-status", "utf8");
  child_process.exec("rm .bni-status");
  stdout
    .split("\n")
    .forEach((line) =>
      line.search("On branch") === 0 ? (state.branch = line.substr(10)) : null
    );
}

function build(state) {
  state.config.environments.forEach((env) => {
    if (env.branch === state.branch) {
      child_process.execSync(`rm -rf ${env.copyDir}`);
      if (env.fileReplacements) {
        env.fileReplacements.forEach(([orig, dest]) => {
          child_process.execSync(`mv ${orig} ${orig}.bkp`);
          child_process.execSync(`cp ${dest} ${orig}`);
        });
      }
      child_process.execSync(env.build);
      if (env.fileReplacements) {
        env.fileReplacements.forEach(([orig, dest]) => {
          child_process.execSync(`mv ${orig} ${dest}`);
          child_process.execSync(`mv ${orig}.bkp ${orig}`);
        });
      }
      child_process.execSync(`mv ./${state.config.buildDir} ./${env.copyDir}`);
    }
  });
}

main(state);
