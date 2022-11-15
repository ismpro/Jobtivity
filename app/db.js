const Sequelize = require('sequelize');
const path = require("path")
const fs = require("fs")

const connection = new Sequelize(require('./config/database'));

let folder = path.resolve("./models")

fs.readdirSync(folder).forEach(file => {
    let Model = require(folder + "/" + file);

    if (Model.init) Model.init(connection);
    if (Model.associate) Model.associate(connection.models);
})

module.exports = connection;