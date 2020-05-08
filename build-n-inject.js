const child_process = require("child_process");
const fs = require("fs");
const state = {
  branch: null,
  config: null,
};

const buildNInject = (state) => {
  loadConfig(state);
  getBranch(state);
  build(state);
  console.log(state);
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
  state.config.environments.forEach((env) => {
    if (env.branch === state.branch) {
      
      if (process.platform === "win32") {
        child_process.execSync(
          `if exist ${".\\investimentos\\" + state.config.buildDir.replace("/", "\\")} rmdir ${".\\investimentos\\" + state.config.buildDir.replace("/", "\\")} /s /q`
        );
        child_process.execSync("cd investimentos && " + env.build.replace("/", "\\") + " && cd ..") ;
        child_process.execSync(
          `if exist ${env.copyDir} rmdir ${env.copyDir} /s /q`
        );
        child_process.execSync(`mkdir ${env.copyDir}`);
        child_process.execSync(
          `xcopy .\\investimentos\\${state.config.buildDir.replace("/", "\\")} .\\investimentos\\${
            env.copyDir.replace("/", "\\")
          } /e /q /y`
        );
      } else {
        child_process.execSync(`rm -rf ${env.copyDir} && rm -rf ${state.config.buildDir}`);
        child_process.execSync("cd investimentos && " + env.build + " && cd ..") ;
        child_process.execSync(`mkdir ${env.copyDir}`);
        child_process.execSync(
          `cp -R ./${state.config.buildDir}/* ${env.copyDir}/`
        );
      }
    }
  });
};

const loadConfig = (state) => {
  state.config = JSON.parse(
    fs.readFileSync("build-n-inject.config.json", "utf8")
  );
};

buildNInject(state);
