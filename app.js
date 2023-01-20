/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
const chalk = require('chalk');
const logger = require('./app/logger');
let DB = require('./config/connection');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const { validationResult } = require('express-validator');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

console.clear()
console.log(chalk.green('\n  Starting server'));

//Config
const app = express();

console.log(chalk.green('  Configurating Server'));

//Some varibles
app.set("port", process.env.PORT || 3000);
global.appRoot = path.resolve(__dirname);
global.NODE_DEV = Boolean(process.env.NODE_ENV === 'development');
console.log(chalk.green(`  Node Mode: ${(global.NODE_DEV ? 'DEV' : 'PRD')}`));


global.checkForErrors = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(215).json({ errors: errors.array() });
    return true;
  } else {
    next();
    return false;
  }
}

let db = new DB({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  schema: 'pw'
})

db.connect().then(function () {

  var sessionStore = new MySQLStore({}, DB.pool);

  app.use(session({
    name: 'sid',
    resave: true,
    saveUninitialized: false,
    secret: process.env.SECRET || 'secretstring',
    store: sessionStore,
    cookie: {
      maxAge: 3600000,
      sameSite: 'lax',
      secure: false
    }
  }));

  //Logger
  app.use(logger)

  // parse application/json
  app.use(bodyParser.json())

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: false
  }))

  //Adding Routes
  app.use('/', require('./routes'));

  //Serving statics files
  //app.use(express.static(path.join(__dirname, 'www')));
  //Para não servir os html diretamente
  app.use('/images', express.static(path.join(__dirname, 'www', 'images')));
  app.use('/styles', express.static(path.join(__dirname, 'www', 'styles')));
  app.use('/scripts', express.static(path.join(__dirname, 'www', 'scripts')));

  app.use('/admin', require('./routes/admin'));
  app.use('/api', require('./routes/api'));
  app.use('/auth', require('./routes/auth'));
  app.use('/friends', require('./routes/friends'));
  app.use('/profile', require('./routes/profile'));
  app.use('/people', require('./routes/people'));
  app.use('/companies', require('./routes/companies'));

  let options = require("./config/swagger.json");

  const specs = swaggerJsdoc(options);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.use('/jsdocs', express.static(path.join(__dirname, 'docs', 'jsdocs')));

  console.log(chalk.green('  Done configurating Server'));

  app.listen(app.get("port"),
    () => {
      console.log(chalk.green(`\n  Server Listing on ${app.get("port")}`))
    })
});