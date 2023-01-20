# Jobtivity

A website for your job needs

Jobtivity is a business social network that is focused on the business world and the more professional side of life, allowing the creation of individual or company profiles. It is comparable to social networks, and is mainly used by professionals to present their skills in a way that other companies can see and analyse. The platform is a vehicle for personal marketing par excellence, allowing different professionals to strengthen their image. It is a good way to promote themselves and build a reputation in their field. Jobtivity is also an excellent tool to search for a job or to look for new job opportunities. Jobtivity is also the perfect place to create a network of professional contacts, either to get new job opportunities, or to enter into collaborations or future partnerships. The site allows registered users to maintain a detailed contact list of people they know and trust.

## Features

- The system must allow all users to access job offers.
- The system must allow job offers to be filtered by duration, area or both.
- The system must allow job offers to be sorted by base value or by expiry date (ascending or descending)
- The system must allow the registration of new users.
- The system must allow users to login.
- The system must have 3 types of users: companies, administrators and professionals.
- The system must allow administrators to see registration requests from companies and accept or reject them.
- The system must allow administrators to view all professional portfolios, regardless of whether the option of being viewed by companies or not and being able to filter by location or age should also be available.
- The system must only allow companies to login when accepted by an administrator.
- The system must send an email if the company registration is rejected by an administrator.
- The system must allow the companies to see the portfolio list of the professionals they chose to be seen by the companies and to filter by location and age.
- The system must allow professionals to add and delete information about the places where they have worked.
- The system should allow professionals to add and delete information about academic courses and other training.
- The system should allow professionals to manage their friends list, make friend requests, accept friend requests, view friends list and remove friends.
- The system should allow professionals to view friends' portfolios.
- The system should allow professionals to put their profile as private so it is hidden from other companies and professionals but not their friends.
- The system may allow users to use a chat so they can communicate.
- The system may allow the company to start a chat with professionals but not the other way around.
- The system may allow professionals to start a conversation with other professionals if they are friends.

## Tech

Jobtivity uses a number of open source projects to work properly:

- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) - JavaScript is a scripting or programming language that allows you to implement complex features on web pages
- [Node.js](https://nodejs.org/) - Node.js is an asynchronous event-driven JavaScript runtime and is designed to build scalable network applications.
- [MySQL](https://www.mysql.com/) - MySQL is a relational database management system (RDBMS) developed by Oracle that is based on structured query language (SQL).

## Installation

Jobtivity requires [Node.js](https://nodejs.org/) to run and a [MySql server](https://www.mysql.com/).

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

## Docs

To access the docs via the browser you uses this links:

- `localhost:PORT/docs` - For the api docs
- `localhost:PORT/jsdocs` - For the jsdocs

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
| bootstrap |  |

## Relational model

![Relational model](/docs/db.png "Relational model")

## Admin Accounts

We have 2 admin accounts:

| Email | Password |
| ------ | ------ |
| admin1@mail.com | BW7dVuGJfQ |
| admin2@mail.com | 7UGXwYFYet |

## Normal Accounts

| Email | Password |
| ------ | ------ |
| deloitte@deloitte.com | 12345Deloitte. |
| kpmg@kpmg.com | 12345Kpmg. |
| ey@ey.com | 12345Ey. |
| joao_sousa@mail.com | 12345Joao. |
| matilde_sampaio@mail.com | 12345Matilde. |
| hugo_ferreira@mail.com | 12345Hugo. |

## Team

Meet the team:

### Ismael Lourenço

<img src="./docs/ismael.png" alt="russo" width="200"/>

### Bruno Russo

<img src="./docs/russo.png" alt="russo" width="200"/>

## License

MIT
