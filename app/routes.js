const path = require('path');

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.status(200).send('<h1>Hello World</h1>');
    })

    app.get('*', function (req, res) {
        res.status(404).sendFile(path.join(global.appRoot, 'views', '404.html'));
    })
}