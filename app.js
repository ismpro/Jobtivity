/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const path = require('path')
const chalk = require('chalk');
const logger = require('./app/logger')

console.clear()
console.log(chalk.green('\n  Starting server'));

//Config
const app = express()
let sequelize = require('./app/db')

//Some varibles
app.set("port", process.env.PORT || 3000);
global.appRoot = path.resolve(__dirname);
global.NODE_DEV = Boolean(process.env.NODE_ENV === 'development');
console.log(chalk.green(`  Node Mode: ${(global.NODE_DEV ? 'DEV' : 'PRD')}`));

console.log(chalk.green('  Configurating Server'));

//Logger
app.use(logger)

//Serving statics files
app.use(express.static('www'))

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

//Adding Routes
require('./routes/index')(app)

console.log(chalk.green('  Done configurating Server'));

(async function () {
  try {
    await sequelize.authenticate({ logging: false });
    console.log(chalk.green('\n  Connection has been established successfully to the database'));
  } catch (error) {
    console.log(chalk.red('  Unable to connect to the database'));
    console.error(error)
  }

  app.listen(app.get("port"),
    () => {
      console.log(chalk.green(`\n  Server Listing on ${app.get("port")}`))
    })
}())




