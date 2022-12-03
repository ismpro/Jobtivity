const path = require("path")
const User = require('../models/UserModel')
const { jsonReader } = require("../config/functions")
const fs = require('fs');

module.exports = function (app) {

    app.get('/about', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'www', 'about.html'))
    })

    app.get('/jobs', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'www', 'jobs.html'))
    })

    app.get('/api/jobs', function (req, res) {
        let p = path.resolve('./jobs.json');
        let data = fs.readFileSync(p)
        res.send(JSON.parse(data))
    })
}

