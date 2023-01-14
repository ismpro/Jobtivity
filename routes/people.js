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
 * Converts a birthdate in age
 * @param {Date} birthdate - birthdate of the user
 * @return {Number} age in years
 */
function calculateAge(birthdate) {
  // calculate the difference between the two dates in milliseconds
  const ageInMilliseconds = Date.now() - birthdate.getTime();
  // convert the difference to years and return it
  return Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365.25);
}


/**
 * @function
 * @route {GET} /all
 * @description Retrieve all professionals and companies for the current user
 */
router.get('/all', async function (req, res) {

    let output = [];
    try {

      //Retrieve all professionals users  
      let users = await User.getAllProfessionalsUsers();
      //Filter professionals that are not the current user  
      for (const user of users) {
            if (req.session.userid !== user.id) {
                output.push(user);
            }
        }

        let professionals = await Promise.all(output.map((user) => Professional.getById(user.professional)));

        //Retrieve current user
        let user = await User.getById(req.session.userid);

        //Filter private professionals if current user is a company
    if (user.isCompany()) {
      output = output.filter((user) => {
        let professional = professionals.find((prof) => prof.id === user.professional);
        return !professional.private;
      });
    }

        //Filter friends if current user is a professional
    if (user.isProfessional()) {
      let friends = await Friend.getAllForProfessional(user.professional);
      output = output.filter((user) => {
        let friend = friends.find(
          (fri) =>
            fri.professional1 === user.professional ||
            fri.professional2 === user.professional
        );
        return friend !== void 0;
      });
    }

        //Send filtered list of professionals
    res.status(200).send(
      output.map((user) => {
        let professional = professionals.find(
          (prof) => prof.id === user.professional
        );
        return {
          idUser: user.id,
          name: user.name,
          description: user.description,
          local: professional.local,
          birthdate: calculateAge(professional.birthday)
        };
      })
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
