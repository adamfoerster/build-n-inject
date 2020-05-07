const exec = require('child_process').exec;

const state = {
  branch: null,
}

const buildCommand = (error, stdout, stderr) => {
  console.log(stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
    throw(error);
  }
  console.log(stdout);
  getBranch(state)
  injectFiles()
}

const getBranch = state => {
  exec('git status', (error, stdout, stderr) => {
    if (error !== null) {
      console.log(error)
      throw(new Error(error))
    }
    stdout
      .split("\n")
      .forEach(line => line.search('On branch') === 0 ? state.branch = line.substr(10) : null)
    if (!state.branch) {
      throw( new Error('Branch not found!'))
    }
  })
}

const injectFiles = () => {
  
}

const child = exec('npm install sass', buildCommand);


