/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')
const helmet = require('helmet')
const chalk = require('chalk');
const morgan = require('morgan')

console.clear()
console.log(chalk.green('\n  Starting server'));

//Config
const app = express()
dotenv.config()

let sequelize = require('./app/db')

//Some varibles
app.set("port", process.env.PORT || 3000);
global.appRoot = path.resolve(__dirname);
global.NODE_MODE = Boolean(process.env.NODE_DEV === 'true');
console.log(chalk.green(`  Node Mode: ${(global.NODE_MODE ? 'DEV' : 'PRD')}`));

console.log(chalk.green('  Configurating Server'));

//Disabling things for security
app.use(helmet())
app.disable('x-powered-by');

/* 
//Webpack configuration
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use((req, res, next) => {
  if (['/jobs', '/about', '/jobs/', '/about/', '/home', '/home/', '/admin', '/admin/'].some((url => req.url === url))
    && !req.url.includes('.png')) {
    req.url = '/' // this would make express-js serve index.html
  }
  next()
})

app.use(webpackDevMiddleware(compiler));
app.use(webpackHotMiddleware(compiler, {
  log: console.log
})); */

//Serving statics files
app.use(express.static('public'))

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

//Logger
app.use(morgan('combined'));

//Adding Routes
//require('./app/routes.js')(app)

console.log(chalk.green('  Done configurating Server'));

(async function() {
  try {
    await sequelize.authenticate();
    console.log(chalk.green('  Connection has been established successfully to database'));
  } catch (error) {
    console.log(chalk.red('  Unable to connect to the database'));
    console.error(error)
  }

  app.listen(app.get("port"),
    () => {
      console.log(chalk.green(`\n  Server Listing on ${app.get("port")}`))
    })
}())




