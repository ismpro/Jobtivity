const path = require("path")

module.exports = function (app) {
    
    app.get('/about', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'public', 'about.html'))
    })
    
    app.get('/jobs', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'public', 'jobs.html'))
    })
}

