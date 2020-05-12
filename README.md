# Build'n'Inject

This project was created because of an specific problem I had while implementing CI/CD in my web projects.

## Getting started

Firstly install the the package.
```
npm i -D build-n-inject
```

Create the config json file according to the example below.

```json
{
  "buildDir": "dist",
  "commands": {
    "develop": "npm run build:dev",
    "master": "npm run build:prod"
  },
  "environments": [
    {
      "name": "Development",
      "branch": "develop",
      "copyDir": "dev",
      "build": "npm run build:dev"
    },
    {
      "name": "QA",
      "branch": "master",
      "copyDir": "qa",
      "build": "npm run build:dev"
    },
    {
      "name": "Staging",
      "branch": "master",
      "copyDir": "stage",
      "build": "npm run build:prod",
      "fileReplacements": [
        [
          "src/params.json",
          "src/params-prod.json"
        ]
      ]
    },
    {
      "name": "Production",
      "branch": "master",
      "copyDir": "prod",
      "build": "npm run build:prod",
      "fileReplacements": [
        [
          "src/params.json",
          "src/params-prod.json"
        ]
      ]
    }
  ]
}
```

You can test the command locally using
```
node ./node_modules/build-n-inject/index.js
```
If it's alright you can add the command to you package.json
```json
"scripts": {
  ...
  "build-n-inject": "node ./node_modules/build-n-inject/index.js"
  ...
},
```
