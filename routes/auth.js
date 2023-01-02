let { Router } = require("express");
const bcrypt = require('bcrypt');
let router = Router();

const User = require("../models/UserModel");
const Profissional = require("../models/ProfissionalModel");
const Company = require("../models/CompanyModel");

router.post('/checkemail', async function (req, res) {
    let data = req.body;
    console.log(data);

    let user = new User({email: data.email});

    if(!(await user.existsByEmail())) {

        res.status(200).send(true);
    } else {
        res.status(210).send("This email is already in use");
    }
})

router.post('/register', async function (req, res) {
    let data = req.body;
    console.log(data);

    let user = new User({email: data.email, name: data.name, description: data.description, admin: false});

    if(!(await user.existsByEmail())) {

        user.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
        await user.create();

        if(data.isCompany) {
            let comp = new Company({
                urlWebsite: data.urlWeb,
                urlLogo: data.urlLogo,
                valid: false,
                user: user.id
            });

            await comp.create();
        } else {
            let profissional = new Profissional({
                birthday: data.birthDate,
                gender: data.gender,
                local: data.local,
                private: data.private,
                user: user.id
            });

            await profissional.create();
        }

        res.status(200).send("User created");
    } else {
        res.status(210).send("This email is already in use");
    }
});

module.exports = router;