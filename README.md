# DI Datahub Express React Redux test app

[![build status](https://img.shields.io/travis/epicallan/di-express-react/master.svg?style=flat-square)](https://travis-ci.org/epicallan/di-express-react)
[![Dependency Status](https://david-dm.org/epicallan/di-express-react.svg?style=flat-square)](https://david-dm.org/epicallan/di-express-react)
[![devDependency Status](https://david-dm.org/epicallan/di-express-react/dev-status.svg?style=flat-square)](https://david-dm.org/epicallan/di-express-react#info=devDependencies)
---

## TODO
- ~~Cache some of the data on the server via redis~~.
- ~~Cache data on the client via session storage eg color ramp and themes data~~
- making map component more re-usable
- deploy branch not working as should!!!
- Clean up and empty session storage cache for unbundling aid data

## Installation

```bash
npm install
```

## Running Dev Server

```
  npm run dev
```

The first time it may take a little while to generate the first `webpack-assets.json` and complain with a few dozen `[webpack-isomorphic-tools] (waiting for the first Webpack build to finish)` printouts, but be patient. Give it 30 seconds.

### Using Redux DevTools

[Redux Devtools](https://github.com/gaearon/redux-devtools) are enabled by default in development.

- <kbd>CTRL</kbd>+<kbd>H</kbd> Toggle DevTools Dock
- <kbd>CTRL</kbd>+<kbd>Q</kbd> Move DevTools Dock Position
- see [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor) for more detailed information.

If you have the
[Redux DevTools chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) installed it will automatically be used on the client-side instead.

If you want to disable the dev tools during development, set `__DEVTOOLS__` to `false` in `/webpack/dev.config.js`.  
DevTools are not enabled during production.

## Building and Running Production Server

```bash
npm run build
npm run start
```

## Explanation

What initially gets run is `bin/server.js`, which does little more than enable ES6 and ES7 awesomeness in the
server-side node code. It then initiates `server.js`. In `server.js` we proxy any requests to `/api/*` to the
[API server](#api-server), running at `localhost:3030`. All the data fetching calls from the client go to `/api/*`.
Aside from serving the favicon and static content from `/static`, the only thing `server.js` does is initiate delegate
rendering to `react-router`. At the bottom of `server.js`, we listen to port `3000` and initiate the API server.

#### Routing and HTML return

The primary section of `server.js` generates an HTML page with the contents returned by `react-router`. First we instantiate an `ApiClient`, a facade that both server and client code use to talk to the API server. On the server side, `ApiClient` is given the request object so that it can pass along the session cookie to the API server to maintain session state. We pass this API client facade to the `redux` middleware so that the action creators have access to it.

Then we perform server-side data fetching, wait for the data to be loaded, and render the page with the now-fully-loaded `redux` state.

The last interesting bit of the main routing section of `server.js` is that we swap in the hashed script and css from the `webpack-assets.json` that the Webpack Dev Server – or the Webpack build process on production – has spit out on its last run. You won't have to deal with `webpack-assets.json` manually because [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools) take care of that.

We also spit out the `redux` state into a global `window.__data` variable in the webpage to be loaded by the client-side `redux` code.

#### Server-side Data Fetching

We ask `react-router` for a list of all the routes that match the current request and we check to see if any of the matched routes has a static `fetchData()` function. If it does, we pass the redux dispatcher to it and collect the promises returned. Those promises will be resolved when each matching route has loaded its necessary data from the API server.

#### Client Side

The client side entry point is reasonably named `client.js`. All it does is load the routes, initiate `react-router`, rehydrate the redux state from the `window.__data` passed in from the server, and render the page over top of the server-rendered DOM. This makes React enable all its event listeners without having to re-render the DOM.

#### Redux Middleware

The middleware, [`clientMiddleware.js`](https://github.com/epicallan/di-express-react/blob/master/src/redux/middleware/clientMiddleware.js), serves two functions:

1. To allow the action creators access to the client API facade. Remember this is the same on both the client and the server, and cannot simply be `import`ed because it holds the cookie needed to maintain session on server-to-server requests.
2. To allow some actions to pass a "promise generator", a function that takes the API client and returns a promise. Such actions require three action types, the `REQUEST` action that initiates the data loading, and a `SUCCESS` and `FAILURE` action that will be fired depending on the result of the promise. There are other ways to accomplish this, some discussed [here](https://github.com/rackt/redux/issues/99), which you may prefer, but to the author of this example, the middleware way feels cleanest.


#### Images

Now it's possible to render the image both on client and server. Please refer to issue [#39](https://github.com/epicallan/di-express-react/issues/39) for more detail discussion, the usage would be like below (super easy):

```javascript
let logoImage = require('./logo.png');
```

#### Styles

This project uses [local styles](https://medium.com/seek-ui-engineering/the-end-of-global-css-90d2a4a06284) using [css-loader](https://github.com/webpack/css-loader). The way it works is that you import your stylesheet at the top of the `render()` function in your React Component, and then you use the classnames returned from that import. Like so:

```javascript
render() {
const styles = require('./App.scss');
...
```

Then you set the `className` of your element to match one of the CSS classes in your SCSS file, and you're good to go!

```jsx
<div className={styles.mySection}> ... </div>
```

**3. Add a CSS loader to the webpack prod config**

You must use the **ExtractTextPlugin** in this loader. In `prod.config.js` modify **module loaders** to include a test and loader for css

```javascript
  module: {
    loaders: [
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
```

**Now you may simply omit assigning the `required` stylesheet to a variable and keep it at the top of your `render()` function.**

```javascript
render() {
require('./App.css');
require('aModule/dist/style.css');
...
```

#### Unit Tests

The project uses [Mocha](https://mochajs.org/) to run your unit tests, it uses [Karma](http://karma-runner.github.io/0.13/index.html) as the test runner, it enables the feature that you are able to render your tests to the browser (e.g: Firefox, Chrome etc.), which means you are able to use the [Test Utilities](http://facebook.github.io/react/docs/test-utils.html) from Facebook api like `renderIntoDocument()`.

To run the tests in the project, just simply run `npm test` if you have `Chrome` installed, it will be automatically launched as a test service for you.

To keep watching your test suites that you are working on, just set `singleRun: false` in the `karma.conf.js` file. Please be sure set it to `true` if you are running `npm test` on a continuous integration server (travis-ci, etc).

## Deployment on Heroku

To get this project to work on Heroku, you need to:

1. Remove the `"PORT": 9090` line from the `betterScripts` / `start-prod` section of `package.json`.
2. `heroku config:set NODE_ENV=production`
3. `heroku config:set NODE_PATH=./src`
4. `heroku config:set NPM_CONFIG_PRODUCTION=false`
  * This is to enable webpack to run the build on deploy.

The first deploy might take a while, but after that your `node_modules` dir should be cached.

## Deployment as Docker container
```
docker build -t dh .
docker run -p 9090:9090 -p 3030:3030  -v /home/di/dh/dh.git:/src --name dh-app -d dh
```
