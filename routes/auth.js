let { Router } = require("express");
const bcrypt = require('bcrypt');
const { createid } = require('../config/functions');
let router = Router();

const User = require("../models/UserModel");
const Professional = require("../models/ProfessionalModel");
const Company = require("../models/CompanyModel");

router.post('/checkemail', async function (req, res) {
    let data = req.body;

    if(errors){
        res.status(210).send(error.message);
    }

    if (!(await User.existsByEmail(data.email))) {

        res.sendStatus(200);
    } else {
        res.status(210).send("This email is already in use");
    }
})

router.post('/register', async function (req, res) {
    let data = req.body;

    if (!(await User.existsByEmail(data.email))) {

        let user = new User({ email: data.email, password: bcrypt.hashSync(data.password, bcrypt.genSaltSync(10)),
            name: data.name, description: data.description, admin: false });

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

router.post('/login', async function (req, res) {
    let data = req.body;
    console.log(data);
    try {
        let user = await User.getByEmail(data.email);

        if (user.isCompany()) {

            let company = await Company.getById(user.company);

            if (!company.valid) {
                res.status(225).send('Company not valid');
                return;
            }
        }

        if (user && bcrypt.compareSync(data.password, user.password)) {
            let sessionId = createid(64);
            req.session.userid = user.id;
            req.session.sessionId = sessionId;
            user.sessionId = sessionId;
            let sessionSave = req.session.save();
            let userSave = user.updateSessionId();

            Promise.all([sessionSave, userSave]).then(() => {
                res.status(200).send({ id: user.id });
            }).catch((err) => {
                console.log(err)
                res.status(500).send('Error on server! Try again later!')
            });
        } else {
            res.status(211).send('Email or password invalid')
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
            if (user && user.sessionId === req.session.sessionId) {
                res.status(200).send({ isAuth: true, isAdmin: user.admin, isProfessional: user.isProfessional()})
            } else {
                res.status(200).send({ isAuth: false })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
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

            await user.updateSessionId();

            Promise.all([user.updateSessionId(), req.session.destroy()])
                .then(() => {
                    res.status(200).send(true)
                }).catch(err => {
                    console.log(err)
                    res.status(500).send(err)
                });
        } else {
            res.status(200).send(false)
        }
    }
})

module.exports = router;