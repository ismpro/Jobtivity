const { Sequelize } = require('sequelize');
const fs = require('fs')
const path = require('path')

const basename = path.basename(__filename)
const db = {}

const sequelize = new Sequelize('pw', 'website', 'mysqlpw1', {
    host: 'localhost',
    dialect: 'mysql'
});

fs.readdirSync('../models')
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
        )
    })
    .forEach((file) => {
        const model = require(path.join('../models', file))(
            sequelize,
            Sequelize.DataTypes
        )
        db[model.name] = model
    })

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize

module.exports = db