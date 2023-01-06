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

const checkForAdmin = async (req, res, next) => {
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

router.get('/login', redirectHome);
router.get('/registration', redirectHome);
router.get('/admin', checkForAdmin);
router.get('/admin.html', checkForAdmin);
router.get('/scripts/admin.js', async function (req, res) {
    if (req.session.userid) {

        let user = await User.getById(req.session.userid);

        if (user && user.sessionId === req.session.sessionId && user.admin) {
            res.status(200).sendFile(path.join(global.appRoot, 'www', 'scripts','admin.js'));
        } else {
            res.status(401).send('Unauthorized');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

router.get('/*', function (req, res, next) {
    if (fs.existsSync(path.join(global.appRoot, 'www', `${req.path.slice(1)}.html`))) {
        res.status(200).sendFile(path.join(global.appRoot, 'www', `${req.path.slice(1)}.html`));
    } else {
        next();
    }
});

module.exports = router;