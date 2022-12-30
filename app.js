/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
console.clear()
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const logger = require('./config/logger');
let DB = require('./config/connection');
const { isGeneratorFunction } = require('util/types');

console.clear()
console.log(chalk.green('\n  Starting server'));

//Config
const app = express()
const Router = express.Router

console.log(chalk.green('  Configurating Server'));

//Some varibles
app.set("port", process.env.PORT || 3000);
global.appRoot = path.resolve(__dirname);
global.NODE_DEV = Boolean(process.env.NODE_ENV === 'development');
console.log(chalk.green(`  Node Mode: ${(global.NODE_DEV ? 'DEV' : 'PRD')}`));

let db = new DB({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  schema: 'pw'
})

//Logger
app.use(logger)

//Serving statics files
app.use(express.static(path.join(__dirname, 'www')))

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

//Adding Routes
app.get('/*', function (req, res, next) {
  if(fs.existsSync(path.join(global.appRoot, 'www', `${req.path.slice(1)}.html`))) {
    res.status(200).sendFile(path.join(global.appRoot, 'www', `${req.path.slice(1)}.html`));
  } else {
    next();
  }
});

app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));

console.log(chalk.green('  Done configurating Server'));

db.connect().then(function () {
  app.listen(app.get("port"),
    () => {
      console.log(chalk.green(`\n  Server Listing on ${app.get("port")}`))
    })


    /* let User = require("./models/UserModel");

    let user = new User({id: 1})
    user.exists().then((res)=> console.log(res)) */

})






