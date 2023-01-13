let { Router } = require("express");
const bcrypt = require('bcrypt');
const { createid } = require('../config/functions');
const { body } = require('express-validator');
let router = Router();

const User = require("../models/UserModel");
const Professional = require("../models/ProfessionalModel");
const Company = require("../models/CompanyModel");

router.post('/checkemail',
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])/)
        .withMessage('Password must contain at least one uppercase and one lowercase letter'),
    body('confirmPassword')
        .custom(async (confirmPassword, { req }) => {
            const password = req.body.password;

            if (password !== confirmPassword) {
                throw new Error('Passwords must be same')
            }
        }),
    global.checkForErrors,
    async function (req, res) {
        let data = req.body;
        if (!(await User.existsByEmail(data.email))) {

            res.sendStatus(200);
        } else {
            res.status(210).send("This email is already in use");
        }
    })

router.post('/register',
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])/)
        .withMessage('Password must contain at least one uppercase and one lowercase letter'),
    body('confirmPassword')
        .custom(async (confirmPassword, { req }) => {
            const password = req.body.password;

            if (password !== confirmPassword) {
                throw new Error('Passwords must be same')
            }
        }),
    body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('description').isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
    global.checkForErrors,
    async function (req, res) {
        let fields = [];
        if (req.body.isCompany === null) {
            fields = [
                body('birthDate').isLength({ min: 8 }).withMessage('Birthdate must be provided').toDate(),
                body('gender').isIn(['M', 'F']).withMessage('Gender must be either M or F'),
                body('local').isLength({ min: 5 }).withMessage('Location must be provided'),
                body('private').isBoolean().withMessage('Private must be a boolean').toBoolean()
            ]
        } else {
            fields = [
                body('urlWeb').isURL().withMessage('Please enter a valid website url'),
                body('urlLogo').isURL().withMessage('Please enter a valid logo url')
            ]
        }

        if (global.checkForErrors()) return;

        let data = req.body;

        if (!(await User.existsByEmail(data.email))) {

            let user = new User({
                email: data.email, password: bcrypt.hashSync(data.password, bcrypt.genSaltSync(10)),
                name: data.name, description: data.description, admin: false
            });

            if (data.isCompany) {
                let comp = new Company({
                    urlWebsite: data.urlWeb,
                    urlLogo: data.urlLogo,
                    valid: false
                });

                await comp.create();
                user.company = comp.id;
            } else {
                let professional = new Professional({
                    birthday: data.birthDate,
                    gender: data.gender,
                    local: data.local,
                    private: data.private
                });

                await professional.create();
                user.professional = professional.id;
            }

            await user.create();

            res.status(200).send("User created");
        } else {
            res.status(210).send("This email is already in use");
        }
    });

router.post('/login',
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').exists().withMessage('Please enter a password'),
    global.checkForErrors,
    async function (req, res) {
        let data = req.body;
        try {

            console.log(data)
            let user = await User.getByEmail(data.email);

            if (!user) {
                res.status(211).send('Email or password invalid');
                return;
            }

            if (user.isCompany()) {
                let company = await Company.getById(user.company);

                if (!company.valid) {
                    res.status(225).send('Company not valid');
                    return;
                }
            }

            if (bcrypt.compareSync(data.password, user.password)) {
                let sessionId = createid(64);
                req.session.userid = user.id;
                req.session.email = user.email;
                req.session.sessionId = sessionId;
                user.sessionId = sessionId;
                let sessionSave = req.session.save();
                let userSave = user.update();

                Promise.all([sessionSave, userSave]).then(() => {
                    res.status(200).send({ id: user.id });
                }).catch((err) => {
                    console.log(err)
                    res.sendStatus(500);
                });
            } else {
                res.status(211).send('Email or password invalid');
            }
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    });

router.post('/validate', async function (req, res) {
    if (req.session.userid) {
        try {
            let user = await User.getById(req.session.userid);
            if (user
                && user.sessionId === req.session.sessionId
                && user.email === req.session.email) {
                res.status(200).send({ isAuth: true, isAdmin: user.admin, isProfessional: user.isProfessional() })
            } else {
                await req.session.destroy();
                res.status(200).send({ isAuth: false })
            }
        } catch (error) {
            console.log(error)
            res.sendStatus(500);
        }
    } else {
        res.status(200).send({ isAuth: false })
    }
});

router.post('/logout', async function (req, res) {
    if (req.session.userid) {
        let user = await User.getById(req.session.userid);

        if (user) {
            user.sessionId = 'expired';

            Promise.all([user.update(), req.session.destroy()])
                .then(() => {
                    res.status(200).send(true)
                }).catch(err => {
                    console.log(err)
                    res.sendStatus(500);
                });
        } else {
            res.status(200).send(false)
        }
    }
})

module.exports = router;