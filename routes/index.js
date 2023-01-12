const User = require("../models/UserModel");
const express = require("express");
const path = require("path");
const fs = require("fs");
let router = express.Router();

/**
 * Redirect Middleware for when you are log in
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.Next} next
 */
const redirectHome = async (req, res, next) => {
    if (req.session.userid) {

        let user = await User.getById(req.session.userid);

        if (user && user.sessionId === req.session.sessionId) {
            res.redirect('/')
        } else {
            next()
        }
    } else {
        next()
    }
}

router.get('/', function (req, res) {
    res.status(200).sendFile(path.join(global.appRoot, 'www', `index.html`));
});

router.get('/favicon.ico', function (req, res) {
    res.status(200).sendFile(path.join(global.appRoot, 'www', `favicon.ico`));
});

router.get('/login', redirectHome);
router.get('/registration', redirectHome);

router.get('/admin', async (req, res) => {
    if (req.session.userid) {

        let user = await User.getById(req.session.userid);

        if (user && user.sessionId === req.session.sessionId && user.admin) {
            res.status(200).sendFile(path.join(global.appRoot, 'www', 'admin.html'));
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
}
);

router.get('/*', function (req, res, next) {
    if (fs.existsSync(path.join(global.appRoot, 'www', `${req.path.slice(1)}.html`))) {
        res.status(200).sendFile(path.join(global.appRoot, 'www', `${req.path.slice(1)}.html`));
    } else {
        next();
    }
});

router.get('/scripts/admin.js', async function (req, res) {
    if (req.session.userid) {

        let user = await User.getById(req.session.userid);

        if (user && user.sessionId === req.session.sessionId && user.admin) {
            res.status(200).sendFile(path.join(global.appRoot, 'www', 'scripts', 'admin.js'));
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;