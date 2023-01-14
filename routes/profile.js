let { Router } = require("express");
let router = Router();

const User = require("../models/UserModel");
const Professional = require("../models/ProfessionalModel");
const Qualification = require("../models/QualificationModel");
const PastJob = require("../models/PastJobModel");
const { query, body, validationResult } = require("express-validator");

const checkLoggedIn = async function (req, res, next) {
  if (req.session.userid) {
    try {
      let user = await User.getById(req.session.userid);

      if (
        user &&
        user.sessionId === req.session.sessionId &&
        user.email === req.session.email
      ) {
        next();
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(401);
  }
};

// All Users
router.get(
  "/user",
  query("id").optional().isInt().withMessage("Id must be a integer").toInt(),
  global.checkForErrors,
  async function (req, res) {
    let data = req.query;
    try {
      let user;
      if (data.id) {
        user = await User.getById(parseInt(data.id));
        if (!user || !user.isProfessional()) {
          res.status(401).send("Invalid ID");
          return;
        }
      } else {
        user = await User.getById(req.session.userid);

        if (
          !user ||
          !user.sessionId === req.session.sessionId ||
          !user.isProfessional()
        ) {
          res.sendStatus(401);
          return;
        }
      }

      let professional = await Professional.getProfessionalById(
        user.professional
      );
      let qualification = await Qualification.getQualificationById(
        user.professional
      );
      let experience = await PastJob.getPastJobById(user.professional);

      res.status(200).send({
        idProfessional: professional.id,
        name: user.name,
        description: user.description,
        birthday: professional.birthday,
        gender: professional.gender,
        local: professional.local,
        qualification: qualification,
        experience: experience,
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/user",
  checkLoggedIn,
  body("id").isInt().withMessage("Id must be a integer").toInt(),
  body("name")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("description")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters"),
  body("local").isLength({ min: 5 }).withMessage("Location must be provided"),
  global.checkForErrors,
  async function (req, res) {
    
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(215).json({ errors: errors.array() });
            return;
        }

    let data = req.body;
    let id = data.id;
    try {
      let [user, professional] = await Promise.all([
        User.getByProfessionalId(id),
        Professional.getById(id),
      ]);

      user.name = data.name;
      user.description = data.description;
      professional.local = data.local;

      await Promise.all([user.update(), professional.update()]);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/qualification",
  checkLoggedIn,
  body("id").isInt().withMessage("Professional Id must be a integer").toInt(),
  body("grade")
    .isInt({ min: 0, max: 20 })
    .withMessage("Grade must be a integer between 0 and 20")
    .toInt(),
  body("name")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("type")
    .isLength({ min: 2 })
    .withMessage("Type must be at least 2 characters"),
  body("local").isLength({ min: 5 }).withMessage("Location must be provided"),
  global.checkForErrors,
  async function (req, res) {
    let data = req.body;
    console.log("Qual ->");
    console.log(data);
    let qualification = new Qualification({
      local: data.local,
      name: data.name,
      type: data.type,
      grade: data.grade,
      professional: data.id,
    });

    await qualification.create();

    res.status(200).send("Qualification created");
  }
);

router.post(
  "/experience",
  checkLoggedIn,
  body("id").isInt().withMessage("Professional Id must be a integer").toInt(),
  body("name")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("url")
    .matches(
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
    )
    .withMessage("Invalid URL"),
  body("beginDate")
    .isLength({ min: 8 })
    .withMessage("Begin Date must be provided")
    .toDate(),
  body("endDate")
    .isLength({ min: 8 })
    .withMessage("End Date must be provided")
    .toDate(),
  body("description")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters"),
  global.checkForErrors,
  async function (req, res) {
    let data = req.body;
    let experience = new PastJob({
      name: data.name,
      url: data.url,
      beginDate: data.beginDate,
      endDate: data.endDate,
      description: data.description,
      professional: data.id,
    });
    await experience.create();

    res.status(200).send("Experience created");
  }
);

module.exports = router;
