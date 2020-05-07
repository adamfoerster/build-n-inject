const child_process = require("child_process");
const fs = require("fs");
const state = {
  branch: null,
  config: null,
};

const buildNInject = async (state) => {
  await loadConfig(state);
  getBranch(state);
  build(state);
  copyDir(state);
  console.log(state);
  injectFiles();
};

const getBranch = async (state) => {
  child_process.execSync("git status > .bni-status");
  const stdout = fs.readFileSync(".bni-status", "utf8");
  child_process.exec("rm .bni-status");
  stdout
    .split("\n")
    .forEach((line) =>
      line.search("On branch") === 0 ? (state.branch = line.substr(10)) : null
    );
};

const build = (state) => {
  child_process.execSync(
    "cd investimentos && " + state.config.commands[state.branch]
  );
};

const copyDir = (state) => {
  state.config.environments.forEach((env) => {
    if (env.branch === state.branch) {
      if (process.platform === "win32") {
        child_process.execSync(`if exist ${env.copyDir} rmdir ${env.copyDir} /s /q`);
        child_process.execSync(`mkdir ${env.copyDir}`);
        child_process.execSync(
          `xcopy .\\${state.config.buildDir.replace("/","\\")} .\\${env.copyDir} /e`
        );
      } else {
        child_process.execSync(`rm -rf ${env.copyDir}`);
        child_process.execSync(`mkdir ${env.copyDir}`);
        child_process.execSync(
          `cp -R ./${state.config.buildDir} ${env.copyDir}/`
        );
      }
    }
  });
};

const injectFiles = () => {};

const loadConfig = (state) => {
  state.config = JSON.parse(
    fs.readFileSync("build-n-inject.config.json", "utf8")
  );
};

buildNInject(state);
