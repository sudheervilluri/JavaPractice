# dwt-service

Data Warehouse Tools service

This project contains the service layer of DWT web application. The services are written in NodeJS.

## Style Standards and Conventions

This project will follow [AirBnB ES6 Style Guide](https://github.com/airbnb/javascript). We are following Dash Case for naming files/folders. Developers are expected to follow the same in the future as well for consistency.

An example of Dash-case would be:

`Raw: user login count`

`Dash Case: user-login-count`

## Unit Testing Dependencies

- Jest and Enzyme for running unit tests and generating code coverage reports.
- easygraphql-tester library to support testing the graphql service.

## Pre-requisites

- DWT project requires NodeJS v10.16.0 to be installed.
- Git Bash should be installed and path to its bin folder should be set to the environment variables.

## Instructions to Setup and Run the service

### How to setup the repository

Once developers clone the repository they need to run the following script to configure the git-hooks:

```shell
$ npm run init
...
```

### How to Build

The following command installs all dependencies, runs linters, executes unit tests and generates unit test and coverage reports:

```shell
$ npm run build
...
```

### How to Run Tests

```shell
$ npm test
...
```

### How to Generate Test Coverage

```shell
$ npm run coverage
...
```

### How to Generate Unit Test Evidence and Coverage for ProcessIT

```shell
$ npm run report
...
```

### How to start the server

```shell
$ npm run dist
...
$ npm run start
...
```
