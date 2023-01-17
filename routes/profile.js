let { Router } = require("express");
let router = Router();

const User = require("../models/UserModel");
const Professional = require("../models/ProfessionalModel");
const Qualification = require("../models/QualificationModel");
const PastJob = require("../models/PastJobModel");
const { query, body } = require("express-validator");

const checkLoggedIn = async function (req, res, next) {
  if (req.session.userid) {
    next();
  } else {
    res.sendStatus(401);
  }
};

// All Users
router.get("/user",
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

      let [professional, qualification, experience] = await Promise.all([Professional.getProfessionalById(user.professional),
      Qualification.getQualificationByProfessionalId(user.professional),
      PastJob.getPastJobByProfessionalId(user.professional)]);

      res.status(200).send({
        idProfessional: professional.id,
        name: user.name,
        description: user.description,
        birthday: professional.birthday,
        gender: professional.gender,
        local: professional.local,
        private: professional.private,
        qualification: qualification,
        experience: experience,
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.put("/user",
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
      professional.private = data.private;

      await Promise.all([user.update(), professional.update()]);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post("/qualification",
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

router.put("/qualification",
  checkLoggedIn,
  body("id").isInt().withMessage("Professional Id must be a integer").toInt(),
  body("name")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("local").isLength({ min: 5 }).withMessage("Location must be provided"),
  body("type")
    .isLength({ min: 2 })
    .withMessage("Type must be at least 2 characters"),
  body("grade")
    .isInt({ min: 0, max: 20 })
    .withMessage("Grade must be a integer between 0 and 20")
    .toInt(),
  global.checkForErrors,
  async function (req, res) {
    let data = req.body;
    let id = data.id;

    try {
      let qualification = await Qualification.getQualificationById(id);

      qualification.local = data.local;
      qualification.name = data.name;
      qualification.type = data.type;
      qualification.grade = data.grade;

      await qualification.update();
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

router.delete("/qualification",
  checkLoggedIn,
  body('id').isInt().withMessage('Please enter a valid id').toInt(),
  global.checkForErrors,
  async function (req, res) {
    try {
      let qualification = await Qualification.getQualificationById(req.body.id);
      await qualification.delete();
      res.status(200).send("Qualification deleted");
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

router.post("/experience",
  checkLoggedIn,
  body("id").isInt().withMessage("Professional Id must be a integer").toInt(),
  body("name")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("url").isURL({require_protocol: true})
    .withMessage("Invalid URL"),
  body("beginDate")
    .isDate()
    .withMessage("Begin Date must be provided")
    .toDate(),
  body("endDate")
    .isDate()
    .withMessage("End Date must be provided")
    .toDate(),
  body("description")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters"),
  global.checkForErrors,
  async function (req, res) {
    try {
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
    } catch (error) {
      console.error(error);
      res.sendStatus(error);
    }
  }
);

router.put("/experience",
  checkLoggedIn,
  body("beginDate")
    .isDate()
    .withMessage("Begin Date must be provided")
    .toDate(),
  body("endDate")
    .isDate()
    .withMessage("Begin Date must be provided")
    .toDate(), 
  body("url").isURL({require_protocol: true})
    .withMessage("Invalid URL"),
    global.checkForErrors,
  async function (req, res) {
    let data = req.body;
    let id = data.id;

    try {
      let experience = await PastJob.getPastJobById(id);
      experience.name = data.name;
      experience.url = data.url;
      experience.beginDate = data.beginDate;
      experience.endDate = data.endDate;
      experience.description = data.description;

      await experience.update();
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.delete("/experience",
  checkLoggedIn,
  body('id').isInt().withMessage('Please enter a valid id').toInt(),
  global.checkForErrors,
  async function (req, res) {
    try {
      let experience = await PastJob.getPastJobById(req.body.id);
      await experience.delete();
      res.status(200).send("Qualification deleted");
    } catch (error) {
      console.log(error);
      res.sendStatus(error);
    }
  });

module.exports = router;
