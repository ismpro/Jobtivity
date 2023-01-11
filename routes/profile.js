let { Router } = require("express");
const bcrypt = require('bcrypt');
const { createid } = require('../config/functions');
let router = Router();

const User = require("../models/UserModel");
const Professional = require("../models/ProfessionalModel");
const Qualification = require("../models/QualificationModel");
const PastJob = require("../models/PastJobModel");

// All Users
router.get('/user', async function (req, res) {
    let data = req.query;
    try {
        if(data.id){
            let user = await User.getById(parseInt(data.id));
            let professional = await Professional.getProfessionalById(user.professional);
            let qualification = await Qualification.getQualificationById(user.professional);
            let experience = await PastJob.getPastJobById(user.professional);
            res.status(200).send(
                {
                    idProfessional: professional.id,
                    name: user.name,
                    description: user.description,
                    birthday: professional.birthday,
                    gender: professional.gender,
                    local: professional.local,
                    qualification: qualification,
                    experience: experience
                }
            ); 
        }else{
            let user = await User.getById(req.session.userid);
            console.log(user);
            if (user && user.sessionId === req.session.sessionId && user.isProfessional()) {
                let professional = await Professional.getProfessionalById(user.professional);
                let qualification = await Qualification.getQualificationById(user.professional);
                let experience = await PastJob.getPastJobById(user.professional);
                console.log(qualification);
                res.status(200).send(
                    {
                        idProfessional: professional.id,
                        name: user.name,
                        description: user.description,
                        birthday: professional.birthday,
                        gender: professional.gender,
                        local: professional.local,
                        qualification: qualification,
                        experience: experience
                    }
                );
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/user', async function(req, res){
    let data = req.body;
    let id = data.id;
    try{
        let updatedUser = await User.update(id, data);
        res.sendStatus(200);
    }catch(error){
        console.log(error);
        res.status(500);
    }
})

router.post('/qualification', async function(req, res){
    let data = req.body;
    console.log("Qual ->");
    console.log(data);
    let qualification = new Qualification({local: data.local, name: data.name,
        type: data.type, grade: data.grade, professional: data.id});

    await qualification.create();

    res.status(200).send("Qualification created");
})

module.exports = router;