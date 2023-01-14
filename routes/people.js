/**
 * @file Express router for handling job related routes
 * @module routes/people
 */
let { Router } = require("express");
let router = Router();

const User = require("../models/UserModel");
const Professional = require("../models/ProfessionalModel");
const Friend = require("../models/FriendModel");

/**
 * @function
 * @route {GET} /all
 * @description Retrieve all professionals and companies for the current user
 */
router.get('/all', async function (req, res) {

    let output = [];
    try {

        //Retrieve all professionals users
        let professionals = await User.getAllProfessionalsUsers();
        //Filter professionals that are not the current user
        for (const professional of professionals) {
            if (req.session.userid !== professional.id) {
                output.push(professional);
            }
        }

        //Retrieve current user
        let user = await User.getById(req.session.userid);

        //Filter private professionals if current user is a company
        if (user.isCompany()) {
            let professionals = await Promise.all(output.map(user => Professional.getById(user.professional)));
            output = output.filter(user => {
                let professional = professionals.find(prof => prof.id === user.professional);
                return !professional.private
            })
        }

        //Filter friends if current user is a professional
        if (user.isProfessional()) {
            let friends = await Friend.getAllForProfessional(user.professional);
            output = output.filter(user => {
                let friend = friends.find(fri => fri.professional1 === user.professional || fri.professional2 === user.professional);
                return (friend !== void 0)
            })
        }

        //Send filtered list of professionals
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