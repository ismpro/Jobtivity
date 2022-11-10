/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')
const logger = require('./app/logger.js')
const helmet = require('helmet')
const chalk = require('chalk');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

console.clear()
console.log(chalk.green('\n  Starting server'));

//Config
const app = express()
app.use(helmet())
dotenv.config()

//Some varibles
app.set("port", process.env.PORT || 3001);
app.set("pin", process.env.PIN || 1234);
global.appRoot = path.resolve(__dirname);
global.NODE_MODE = Boolean(process.env.NODE_DEV === 'true');
console.log(chalk.green(`  Node Mode: ${(global.NODE_MODE ? 'DEV' : 'PRD')}`));

//Disabling things for security
app.disable('x-powered-by');

//Webpack
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler));
app.use(webpackHotMiddleware(compiler, {
  log: console.log
}));

//Serving statics files
app.use(express.static('public'))

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

//Logger
app.use(logger());

//Adding Routes
//require('./app/routes.js')(app)

app.listen(3000,
() => {
    console.log(chalk.green(`\n  Server Listing on 3000`))
})
