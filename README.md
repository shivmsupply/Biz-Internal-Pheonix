# Biz Internal Pheonix

A basic template that consists of the essential elements that are required to start building a Single Page Application using React, React Router, Redux, Bootstrap 4, Sass, and Webpack.

Although I am calling this project a template of sorts, it is also a mini application in that it demonstrates a full verticle slice of the architecture. What this means, is that there is an example of Redux and React-Router in action. I kept the example simple by providing data via a _'Zip Code JSON file'_.

The template consists of:

* a typcial project layout structure
* a Babel setup and configuration
* a Webpack setup and configuration
* an ESLint setup and configuration
* a SCSS setup and configuration
* a sample React component to display list codes
* a Redux setup to handle zip codes state
* a React Router setup to show basic navigation

Additionaly, the template provides a development and production webpack configuration.

The template also allows one to include specific plugins as part of build. [Please see here for more detail](#build-application-with-bundleanalayzer-plugin-included)



## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The following software is required to be installed on your system:

* Node 8.x
* Npm 3.x

Type the following commands in the terminal to verify your node and npm versions

  ```bash
  node -v
  npm -v
  ```

### Install

Follow the following steps to get development environment running.

* Clone _'Biz-Internal-Pheonix'_ repository from GitHub

  ```bash
  git clone https://github.com/shivmsupply/Biz-Internal-Pheonix.git
  ```

   _OR USING SSH_

  ```bash
  git clone git@github.com/shivmsupply/Biz-Internal-Pheonix.git
  ```

* Install node modules

   ```bash
   cd Biz-Internal-Pheonix
   npm install
   ```

### Build

#### Build Application

dev | prod
:---: | :---:
npm run build:dev | npm run build:prod

#### Build Application And Watch For Changes

dev | prod
:---: | :---:
npm run build:dev:watch | npm run build:prod:watch

#### Build Application With BundleAnalayzer Plugin Included

dev | prod
:---: | :---:
npm run build:dev:bundleanalyze | npm run build:prod:bundleanalyze

After running the above command, a browser window will open displaying an interactive graph resembling the following image:

![webpack bundle analyzer](https://user-images.githubusercontent.com/33935506/36639476-30f9479c-1a16-11e8-9d09-1b80355a089b.png)

#### Build Application With BundleBuddy Plugin Included

dev | prod
:---: | :---:
npm run build:dev:bundlebuddy | npm run build:prod:bundlebuddy

### Run ESlint

#### Lint Project Using ESLint

  ```bash
  npm run lint
  ```

#### Lint Project Using ESLint, and autofix

  ```bash
  npm run lint:fix
  ```

### Run

#### Run Start

This will run the _'serve:dev'_ npm task

```bash
npm start
```

#### Run Dev Server

```bash
npm run serve:dev
```

#### Run Dev Server With Dashboard

```bash
npm run serve:dev:dashboard
```

The above command will display a dashboard view in your console resembling the following image:

![webpack-dashboard](https://user-images.githubusercontent.com/33935506/36639594-589409e8-1a18-11e8-84fe-29f7bdafcaa6.png)

#### Run Prod Server

This command will build application using production settings and start the application using _live-server_

```bash
npm run serve:prod
```



## Authors

* **Msupply UI Team** - *Initial work* - [shivmsupply](https://github.com/shivmsupply/)


