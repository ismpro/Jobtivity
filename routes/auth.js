let { Router } = require("express");
const bcrypt = require('bcrypt');
const { createid } = require('../config/functions');
let router = Router();

const User = require("../models/UserModel");
const Profissional = require("../models/ProfissionalModel");
const Company = require("../models/CompanyModel");

router.post('/checkemail', async function (req, res) {
    let data = req.body;
    console.log(data);

    let user = new User({ email: data.email });

    if (!(await user.existsByEmail())) {

        res.status(200).send(true);
    } else {
        res.status(210).send("This email is already in use");
    }
})

router.post('/register', async function (req, res) {
    let data = req.body;
    console.log(data);

    let user = new User({ email: data.email, name: data.name, description: data.description, admin: false });

    if (!(await user.existsByEmail())) {

        user.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
        
        if (data.isCompany) {
            let comp = new Company({
                urlWebsite: data.urlWeb,
                urlLogo: data.urlLogo,
                valid: false
            });

            await comp.create();
            user.company = comp.id;
        } else {
            let profissional = new Profissional({
                birthday: data.birthDate,
                gender: data.gender,
                local: data.local,
                private: data.private
            });

            await profissional.create();
            user.profissional = profissional.id;
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

        if(user.isCompany()){

            let company = await Company.getById(user.company);

            if(!company.valid) {
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
    }
});

/* router.post('/validate', async function (req, res) {
    let data = req.body;
    console.log(data);
    try {
        let user = await User.getByEmail(data.email);

        console.log(user)
        console.log(bcrypt.hashSync(data.password, bcrypt.genSaltSync(10)));
        console.log(bcrypt.compareSync(data.password, user.password));

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
    }
}); */

module.exports = router;