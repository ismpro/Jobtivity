# Jobtivity

A website for your job needs

## Features

- TODO

## Installation

Jobtivity requires [Node.js](https://nodejs.org/) to run and a [MySql server](https://dev.mysql.com/downloads/mysql/).

Install the dependencies and devDependencies and start the server.

```sh
npm i
```

Create the .env file on the root folder.
```sh
#Env Varaibles

#Port of the website (default: 3000)
PORT=80

#If you are in dev mode put true to not keep logs
NODE_ENV=development

#String session secret
SECRET=asdavdliqwçidwql21g873g4f2

#DB Info
DB_HOST= #host of the server mysql
DB_USER= #username of the user on mysql
DB_PASS= #password of the user on mysql
```

Run the server

```sh
npm run start
```

Done! Now you can access using the link `localhost:PORT`
 
## Frameworks

Below is a list of framework used in the project.

| Framework | Description |
| ------ | ------ |
| bcrypt | A library to help hash passwords. |
| body-parser | Node.js body parsing middleware. Parse incoming request bodies in a middleware before your handlers, available under the req.body property. |
| express | Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. |
| morgan | HTTP request logger middleware for node.js |
| dotenv | Dotenv is a module that loads environment variables from a .env file into process.env |
| chalk | Chalk module in Node. js is used for styling the format of text and allows us to create our own themes in the node. js project. |
| mysql2 | MySQL client for Node.js. MySQL2 is a continuation of MySQL-Native. |
| axios | Promise based HTTP client for the browser and node.js |

## Relational model

![Relational model](/docs/db.png "Relational model")

## Team

Meet the team:

### Ismael Lourenço

<img src="./docs/ismael.png" alt="russo" width="200"/>

### Bruno Russo

<img src="./docs/russo.png" alt="russo" width="200"/>

## License

MIT