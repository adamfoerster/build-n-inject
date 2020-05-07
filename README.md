# Build'n'Inject

This project was created because of an specific problem I had while implementing CI/CD in my web projects. We would use the same code to build for more than one environment. So we had to call the build several times just to copy the corresponding environment params files. This way we would pay for many more minutes than we should.

## Getting started

Firstly create the config json file.

```json
{
  buildDir: 'dist',
  environments: [
    {
      name: 'Development',
      branch: 'develop',
      copyDir: '',
      files: [
        {}
      ]
    }
  ]
}
```