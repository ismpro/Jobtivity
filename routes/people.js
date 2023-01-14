let { Router } = require("express");
let router = Router();

const User = require("../models/UserModel");

// All Users
router.get('/all', async function (req, res) {

    let output = [];
    try {

        let user = await User.getById(req.session.userid);

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
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = router;