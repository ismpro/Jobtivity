let { Router } = require("express");
const bcrypt = require('bcrypt');
let router = Router();

const User = require("../models/UserModel")
const Profissional = require("../models/ProfissionalModel")

router.post('/register', async function (req, res) {
    let data = req.body;
    console.log(data);

    let user = new User({email: data.email, name: data.name, description: data.description, admin: false});

    if(!(await user.existsByEmail())) {

        user.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(9));
        await user.create();

        if(data.isCompany) {
            //TODO
        } else {
            let profissional = new Profissional({
                birthday: data.birthDate,
                gender: data.gender,
                local: data.local,
                private: data.private,
                user: user.id
            });

            await profissional.create();
            res.status(200).send(true);
        }
    }
});

module.exports = router;