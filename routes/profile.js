let { Router } = require("express");
let router = Router();

const User = require("../models/UserModel");
const Professional = require("../models/ProfessionalModel");
const Qualification = require("../models/QualificationModel");
const PastJob = require("../models/PastJobModel");
const { query, body } = require("express-validator");

/**
 * @function checkLoggedIn
 * @async
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {function} next - Express next middleware function
 * 
 * Check if a user is logged in by checking the session's userid.
 * If not, return a 401 status with a message 'Unauthorized', otherwise call the next middleware function.
 */
const checkLoggedIn = async (req, res, next) => {
  if (!req.session.userid) {
    return res.status(401).send('Unauthorized');
  }

  next();
};

/**
 * @route {GET} /profile/user
 * @description Get user data by ID or by session if ID is not provided.
 *
 * definitions:
 *  User:
 *    type: object
 *    properties:
 *      idProfessional:
 *        type: integer
 *      name:
 *        type: string
 *      description:
 *        type: string
 *      birthday:
 *        type: string
 *      gender:
 *        type: string
 *      local:
 *        type: string
 *      private:
 *        type: boolean
 *      birthday:
 *        type: string
 *      qualification:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *            name:
 *              type: string
 *            local:
 *              type: string
 *            type:
 *              type: string
 *            grade:
 *              type: string
 *            professional:
 *              type: integer
 *      experience:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *            name:
 *              type: string
 *            url:
 *              type: string
 *            beginDate:
 *              type: string
 *              format: date
 *            endDate:
 *              type: string
 *              format: date
 *            description:
 *              type: string
 *            professional:
 *              type: integer
 * /profile/user:
 *   get:
 *     summary: Get user data by ID or by session if ID is not provided.
 *     tags:
 *       - Profile
 *     parameters:
 *       - name: id
 *         in: query
 *         description: ID of the user.
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         schema:
 *           $ref: '#/definitions/User'
 *       215:
 *           description: Validation errors
 *           content:
 *              application/json:
 *                   schema:
 *                       properties:
 *                           errors:
 *                           type: array
 *                       items:
 *                           properties:
 *                              msg:
 *                                  type: string
 *                              param:
 *                                  type: string
 *                              location:
 *                                  type: string 
 *       400:
 *         description: Invalid ID provided
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error on server
 */
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
          res.status(400).send("Invalid ID");
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

/**
 * @route {PUT} /profile/user
 * @description Updates the information of the user
 * @swagger
 * /profile/user:
 *   put:
 *     tags:
 *       - Profile
 *     description: Update user information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               description:
 *                 type: string
 *                 example: "A professional software developer"
 *               local:
 *                 type: string
 *                 example: "Setubal"
 *               private:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Successfully updated user information
 *       215:
 *           description: Validation errors
 *           content:
 *              application/json:
 *                   schema:
 *                       properties:
 *                           errors:
 *                           type: array
 *                       items:
 *                           properties:
 *                              msg:
 *                                  type: string
 *                              param:
 *                                  type: string
 *                              location:
 *                                  type: string 
 *       400:
 *         description: Professional Id invalid
 *       500:
 *         description: Internal Server Error
 */
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
  body("private").isBoolean().withMessage("Private must be a boolean").toBoolean(),
  global.checkForErrors,
  async function (req, res) {
    let data = req.body;
    let id = data.id;
    try {
      let [user, professional] = await Promise.all([
        User.getByProfessionalId(id),
        Professional.getById(id),
      ]);

      if (!user || !professional) {
        return res.status(400).send("Professional Id invalid")
      }

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

/**
 * @route {post} /profile/qualification
 * @description Create a new Qualification
 * @swagger
 * /profile/qualification:
 *   post:
 *     tags:
 *       - Profile
 *     description: Create a new Qualification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               grade:
 *                 type: integer
 *                 example: 10
 *               name:
 *                 type: string
 *                 example: "PW"
 *               type:
 *                 type: string
 *                 example: "Faculdade"
 *               local:
 *                 type: string
 *                 example: "Setubal"
 *     responses:
 *       200:
 *         description: Qualification created successfully
 *       215:
 *           description: Validation errors
 *           content:
 *              application/json:
 *                   schema:
 *                       properties:
 *                           errors:
 *                           type: array
 *                       items:
 *                           properties:
 *                              msg:
 *                                  type: string
 *                              param:
 *                                  type: string
 *                              location:
 *                                  type: string 
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal Server Error
 */
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
    try {
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
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

/**
 * @route {put} /profile/qualification
 * @description Update an existing Qualification
 * @swagger
 * /profile/qualification:
 *   put:
 *     tags:
 *       - Profile
 *     description: Update an existing Qualification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               grade:
 *                 type: integer
 *                 example: 10
 *               name:
 *                 type: string
 *                 example: "PW"
 *               type:
 *                 type: string
 *                 example: "Faculdade"
 *               local:
 *                 type: string
 *                 example: "Setubal"
 *     responses:
 *       200:
 *         description: Qualification updated successfully
 *       215:
 *           description: Validation errors
 *           content:
 *              application/json:
 *                   schema:
 *                       properties:
 *                           errors:
 *                           type: array
 *                       items:
 *                           properties:
 *                              msg:
 *                                  type: string
 *                              param:
 *                                  type: string
 *                              location:
 *                                  type: string 
 *       400:
 *         description: Qualification Id invalid
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

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

      if (!qualification) {
        return res.status(400).send("Qualification Id invalid")
      }

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

/**
 * @route {delete} /profile/qualification
 * @description Deletes an existing Qualification
 * @swagger
 * /qualification:
 *   delete:
 *     tags:
 *       - Profile
 *     description: Deletes an existing Qualification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Qualification deleted successfully
 *       215:
 *           description: Validation errors
 *           content:
 *              application/json:
 *                   schema:
 *                       properties:
 *                           errors:
 *                           type: array
 *                       items:
 *                           properties:
 *                              msg:
 *                                  type: string
 *                              param:
 *                                  type: string
 *                              location:
 *                                  type: string 
 *       400:
 *         description: Qualification Id invalid
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.delete("/qualification",
  checkLoggedIn,
  body('id').isInt().withMessage('Please enter a valid id').toInt(),
  global.checkForErrors,
  async function (req, res) {
    try {
      let qualification = await Qualification.getQualificationById(req.body.id);

      if (!qualification) {
        return res.status(400).send("Qualification Id invalid")
      }

      await qualification.delete();
      res.status(200).send("Qualification deleted");
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

/**
 * @route {post} /profile/experience
 * @description Create a new Professional's Experience
 * @swagger
 * /profile/experience:
 *   post:
 *     tags:
 *       - Experience
 *     description: Create a new Professional's Experience
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Software Engineer"
 *               url:
 *                 type: string
 *                 example: "https://www.example.com"
 *               beginDate:
 *                 type: string
 *                 format: date
 *                 example: "2022-01-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2022-12-31"
 *               description:
 *                 type: string
 *                 example: "I was responsible for developing and maintaining the company's software products"
 *     responses:
 *       201:
 *         description: Experience created successfully
 *       215:
 *           description: Validation errors
 *           content:
 *              application/json:
 *                   schema:
 *                       properties:
 *                           errors:
 *                           type: array
 *                       items:
 *                           properties:
 *                              msg:
 *                                  type: string
 *                              param:
 *                                  type: string
 *                              location:
 *                                  type: string 
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.post("/experience",
  checkLoggedIn,
  body("id").isInt().withMessage("Professional Id must be a integer").toInt(),
  body("name")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("url").isURL({ require_protocol: true })
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

/**
 * @route {put} /profile/experience
 * @description Update an Professional's Experience
 * @swagger
 * /profile/experience:
 *   put:
 *     tags:
 *       - Experience
 *     summary: Update an Professional's Experience
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: id
 *                 description: ID of the experience
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Name of the experience
 *                 example: "Software Engineer"
 *               beginDate:
 *                 type: string
 *                 format: date
 *                 description: Begin date of the experience
 *                 example: "2022-01-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date of the experience
 *                 example: "2022-12-31"
 *               url:
 *                 type: string
 *                 format: url
 *                 description: URL of the experience
 *                 example: "https://example.com"
 *               description:
 *                 type: string
 *                 description: Description of the experience
 *                 example: "Worked on various projects as a software engineer"
 *     responses:
 *       200:
 *         description: Successful update
 *       215:
 *           description: Validation errors
 *           content:
 *              application/json:
 *                   schema:
 *                       properties:
 *                           errors:
 *                           type: array
 *                       items:
 *                           properties:
 *                              msg:
 *                                  type: string
 *                              param:
 *                                  type: string
 *                              location:
 *                                  type: string
 *       400:
 *         description: PastJob Id invalid 
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
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
  body("url").isURL({ require_protocol: true })
    .withMessage("Invalid URL"),
  global.checkForErrors,
  async function (req, res) {
    let data = req.body;
    let id = data.id;

    try {
      let experience = await PastJob.getPastJobById(id);

      if (!experience) {
        return res.status(400).send("PastJob Id invalid")
      }

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

/**
 * @route {delete} /profile/experience
 * @description Delete a Professional's Experience
 * @swagger
 * /profile/experience:
 *   delete:
 *     tags:
 *       - Experience
 *     summary: Delete a Professional's an experience
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: id
 *                 description: ID of the experience
 *                 example: 1 
 *     responses:
 *       200:
 *         description: Successful deteled
 *       215:
 *         description: Validation errors
 *         content:
 *             application/json:
 *                 schema:
 *                     properties:
 *                        errors:
 *                        type: array
 *                     items:
 *                         properties:
 *                            msg:
 *                                type: string
 *                            param:
 *                                type: string
 *                            location:
 *                                type: string 
 *       400:
 *         description: PastJob Id invalid 
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.delete("/experience",
  checkLoggedIn,
  body('id').isInt().withMessage('Please enter a valid id').toInt(),
  global.checkForErrors,
  async function (req, res) {
    try {
      let experience = await PastJob.getPastJobById(req.body.id);

      if (!experience) {
        return res.status(400).send("PastJob Id invalid")
      }

      await experience.delete();
      res.status(200).send("Qualification deleted");
    } catch (error) {
      console.log(error);
      res.sendStatus(error);
    }
  });

module.exports = router;
