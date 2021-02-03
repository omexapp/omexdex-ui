## Development environment

### Release method description

Reason: due to the special dex project,there are some problems with the use of front-end release system to build, so the use of local build.Publishing uses a front-end publishing system.

Premise:each version iteration pulls the latest development branch based on the master branch,i.e. ' daily / X.y.z '(for example 'daily / 0.1.0'), submit the build results to gitlab after the local build.

Build & release:

1. Everyday

In the daily branch, build and commit the code

```
$ npm run daily
```

2. Pre-issue

In the prepub branch, build and commit the code

```
$ npm run prepub
```

3. Online

To be perfect

```
$ npm run publish
```

### Step 1: Configure WebStorm

Setting up the React syntax environment

Preferences > Languages & Frameworks > JavaScript > [select React JSX]

Configuring eslint rules and plug-ins

Link:http://gitlab.omcoin-inc.com/omfe/eslint


### Step 2: run the app

Switch npm warehouse address to company private warehouse (nrm tool is recommended)
```shell
sudo npm i nrm -g
nrm add omex http://192.168.80.41:4873
nrm use omex
```

Installing dependent libraries:

```shell
npm install
```

Then run the application:

```shell
npm run omex
```

According to webpack / dev.common.the proxy path configured in js gets the token to ensure that the request can get the data correctly
Take online data(const mockUrl = 'https://omexcomweb.bafang.com') as an example:

1. Visit https://omexcomweb.bafang.com/index, login(registration);
2. copy the token from Local Storage to local Local Storage;
3. Visit http://localhost:3000/spot/trade;

### npm script command description

1. mock-start the mock data service locally (currently does not ensure that the mock data is 100% correct, in most cases the request is forwarded to the development / test environment);
2. dev-omex,dev-omcoin,dev-omkr are used for three different site developers to start local services;
3. build and testbuild related commands for on-line build and test environment build;

### File naming

You must use hump style naming when creating JS and style files:

```
home
Home.js
Home.scss
HomeConversion.js
HomeConversion.scss
```

When creating a new internationalized Text Property,`key`is used uniformly.Connection:

```js
const messages = {
	'spot.asset.freeze':'freeze',
	'spot.asset.risk': 'risk rate',
	'spot.asset.forceClose':'burst price',
	'spot.asset.interest':'interest',
};
```

CSS class names must be named in hyphen style


Testing
Private key:972d5e3fbe52266e27391b7f165951830d6656461c123d2d76387e6e56a1197e
Password: zZ12345678