let { Router } = require("express");
let router = Router();

const User = require("../models/UserModel");
const Professional = require("../models/ProfessionalModel");
const Friend = require("../models/FriendModel");

// All Users
router.get('/all', async function (req, res) {

    let output = [];
    try {

        let professionals = await User.getAllProfessionalsUsers();
        for (const professional of professionals) {
            if (req.session.userid !== professional.id) {
                output.push(professional);
            }
        }

        let user = await User.getById(req.session.userid);

        if (user.isCompany()) {
            let professionals = await Promise.all(output.map(user => Professional.getById(user.professional)));
            output = output.filter(user => {
                let professional = professionals.find(prof => prof.id === user.professional);
                return !professional.private
            })
        }

        if (user.isProfessional()) {
            let friends = await Friend.getAllForProfessional(user.professional);
            output = output.filter(user => {
                let friend = friends.find(fri => fri.professional1 === user.professional || fri.professional2 === user.professional);
                return (friend !== void 0)
            })
        }

        res.status(200).send(output.map(user => ({
            idUser: user.id,
            name: user.name,
            description: user.description,
        })));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = router;