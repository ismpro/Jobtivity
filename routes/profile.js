let { Router } = require("express");
const bcrypt = require('bcrypt');
const { createid } = require('../config/functions');
let router = Router();

const User = require("../models/UserModel");
const Professional = require("../models/ProfessionalModel");

// All Users
router.get('/user', async function (req, res) {
    try {
        let user = await User.getById(req.session.userid);
        console.log(user);
        if (user && user.sessionId === req.session.sessionId && user.isProfessional()) {
            let professional = await Professional.getProfessionalById(user.professional);
            console.log(professional);
            res.status(200).send(
                {
                    idProfessional: professional.id,
                    name: user.name,
                    description: user.description,
                    birthday: professional.birthday,
                    gender: professional.gender,
                    local: professional.local,
                    session: user.sessionId
                }
            );
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;