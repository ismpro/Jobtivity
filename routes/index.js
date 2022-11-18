const path = require("path")
const User = require('../models/User')

module.exports = function (app) {

    app.get('/about', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'www', 'about.html'))
    })

    app.get('/jobs', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'www', 'jobs.html'))
    })


    app.get('/test', async function (req, res) {
        let user = await User.getById(1)
        res.send(user)
    })
}

