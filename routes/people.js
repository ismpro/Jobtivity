let { Router } = require("express");
const bcrypt = require('bcrypt');
const { createid } = require('../config/functions');
let router = Router();

const User = require("../models/UserModel");

// All Users
router.get('/all', async function (req, res) {

    let output = [];

    try {
        let professionals = await User.getAllProfessionalsUsers();
        for (const professional of professionals){
            if(req.session.userid !== professional.id){
                output.push({
                    idUser: professional.id,
                    name: professional.name,
                    description: professional.description,
                    session: professional.sessionId
                })
            }
        }
        res.status(200).send(output);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;