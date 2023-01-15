/**
 * @file Express router for handling user authentication and validation
 * @module routes/auth
 */
let { Router } = require("express");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
let router = Router();

const User = require("../models/UserModel");
const Professional = require("../models/ProfessionalModel");
const Company = require("../models/CompanyModel");

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
 * Generate a random id
 * @param {number} length - the length of the id to be generated
 * @return {string} the generated id
 */
function createid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * @function
 * @route {POST} /checkemail
 * @description Check if email is already in use
 * @param {string} email - Email to be checked
 * @param {string} password - Password to be checked
 * @param {string} confirmPassword - Confirm password to be matched with password
 * @swagger
 * /auth/checkemail:
 *  post:
 *    tags:
 *    - Auth
 *    summary: Check if email is already in use
 *    parameters:
 *    - in: body
 *      name: email
 *      schema:
 *        type: string
 *      required: true
 *      description: Email to be checked
 *    - in: body
 *      name: password
 *      schema:
 *        type: string
 *      required: true
 *      description: Password to be checked
 *    - in: body
 *      name: confirmPassword
 *      schema:
 *        type: string
 *      required: true
 *      description: Confirm password to be matched with password
 *    responses:
 *      200:
 *        description: Email is not in use
 *      210:
 *        description: Email is already in use
 *      215:
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
 *      500:
 *        description: Internal Server Error
 */
router.post('/checkemail',
    // Check if email is valid
    body('email').isEmail().withMessage('Please enter a valid email address'),
    // Check if password is valid
    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])/)
        .withMessage('Password must contain at least one uppercase and one lowercase letter'),
    // Check if confirm password matches password
    body('confirmPassword')
        .custom(async (confirmPassword, { req }) => {
            const password = req.body.password;

            if (password !== confirmPassword) {
                throw new Error('Passwords must be same')
            }
        }),
    global.checkForErrors,
    // Send response if email is not in use
    async function (req, res) {
        let data = req.body;
        if (!(await User.existsByEmail(data.email))) {

            res.sendStatus(200);
        } else {
            res.status(210).send("This email is already in use");
        }
    })

/**
 * @function
 * @route {POST} /register
 * @description Handle user registration
 * @param {String} email - Email of the user
 * @param {String} password - Password of the user
 * @param {String} confirmPassword - Confirm password to be matched with password
 * @param {String} name - Name of the user
 * @param {String} description - Description of the user
 * @param {Boolean} isCompany - Check if user is a company
 * @param {String} birthDate - Birthdate of the user, if user is not a company
 * @param {String} gender - Gender of the user, if user is not a company
 * @param {String} location - Location of the user, if user is not a company
 * @param {Boolean} private - Privacy setting of the user, if user is not a company
 * @param {String} urlWeb - Website url of the company, if user is a company
 * @param {String} urlLogo - Logo url of the company, if user is a company
 * @swagger
 * /auth/register:
 *  post:
 *    tags:
 *    - Auth
 *    summary: Handle user registration
 *    parameters:
 *    - in: body
 *      name: email
 *      schema:
 *        type: string
 *      required: true
 *      description: Email of the user
 *    - in: body
 *      name: password
 *      schema:
 *        type: string
 *      required: true
 *      description: Password of the user
 *    - in: body
 *      name: confirmPassword
 *      schema:
 *        type: string
 *      required: true
 *      description: Confirm password to be matched with password
 *    - in: body
 *      name: name
 *      schema:
 *        type: string
 *      required: true
 *      description: Name of the user
 *    - in: body
 *      name: description
 *      schema:
 *        type: string
 *      required: true
 *      description: Description of the user
 *    - in: body
 *      name: isCompany
 *      schema:
 *        type: boolean
 *      required: true
 *      description: Check if user is a company
 *    - in: body
 *      name: birthDate
 *      schema:
 *        type: string
 *        format: date
 *      required: false
 *      description: Birthdate of the user, if user is not a company
 *    - in: body
 *      name: gender
 *      schema:
 *        type: string
 *      required: false
 *      description: Gender of the user, if user is not a company
 *    - in: body
 *      name: location
 *      schema:
 *        type: string
 *      required: false
 *      description: Location of the user, if user is not a company
 *    - in: body
 *      name: private
 *      schema:
 *        type: boolean
 *      required: false
 *      description: Privacy setting of the user, if user is not a company
 *    - in: body
 *      name: urlWeb
 *      schema:
 *        type: string
 *      required: false
 *      description: Website url of the company, if user is a company
 *    - in: body
 *      name: urlLogo
 *      schema:
 *        type: string
 *      required: false
 *      description: Logo url of the company, if user is a company
 *    responses:
 *      200:
 *       description: Successfully registered user
 *      210:
 *        description: Email is already in use
 *      215:
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
 *      500:
 *        description: Internal server error
 */
router.post('/register',
    // Check if email is valid
    body('email').isEmail().withMessage('Please enter a valid email address'),
    // Check if password is valid
    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])/)
        .withMessage('Password must contain at least one uppercase and one lowercase letter'),
    // Check if confirm password matches password
    body('confirmPassword')
        .custom(async (confirmPassword, { req }) => {
            const password = req.body.password;

            if (password !== confirmPassword) {
                throw new Error('Passwords must be same')
            }
        }),
    // Check if name is valid
    body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    // Check if description is valid
    body('description').isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
    //Professionals valitions
    // Check if birthDate is valid
    body('birthDate')
        .if((value, { req }) => !req.body.isCompany)
        .isDate()
        .withMessage('Birthdate must be provided')
        .toDate()
        .custom(async (value) => {
            if (calculateAge(value) < 16) {
                throw new Error('Must be 16 or higher')
            }
        }),
    // Check if gender is valid
    body('gender').if((value, { req }) => !req.body.isCompany).isIn(['M', 'F']).withMessage('Gender must be either M or F'),
    // Check if location is valid
    body('local').if((value, { req }) => !req.body.isCompany).isLength({ min: 5 }).withMessage('Location must be provided'),
    // Check if private is a boolean
    body('private').if((value, { req }) => !req.body.isCompany).isBoolean().withMessage('Private must be a boolean').toBoolean(),
    //Company valitions
    // Check if website url is valid
    body('urlWeb').if((value, { req }) => req.body.isCompany).isURL().withMessage('Please enter a valid website url'),
    // Check if logo url is valid
    body('urlLogo').if((value, { req }) => req.body.isCompany).isURL().withMessage('Please enter a valid logo url'),
    global.checkForErrors,
    // Create new User and Professional/Company objects and save to database
    async function (req, res, next) {
        try {
            let data = req.body;

            if (!(await User.existsByEmail(data.email))) {

                let user = new User({
                    email: data.email, password: bcrypt.hashSync(data.password, bcrypt.genSaltSync(10)),
                    name: data.name, description: data.description, admin: false
                });

                if (data.isCompany) {
                    let comp = new Company({
                        urlWebsite: data.urlWeb,
                        urlLogo: data.urlLogo,
                        valid: null
                    });

                    await comp.create();
                    user.company = comp.id;
                } else {
                    let professional = new Professional({
                        birthday: data.birthDate,
                        gender: data.gender,
                        local: data.local,
                        private: data.private
                    });

                    await professional.create();
                    user.professional = professional.id;
                }

                await user.create();

                res.status(200).send("User created");
            } else {
                res.status(210).send("This email is already in use");
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    });

/**
 * @function
 * @route {POST} /login
 * @description Handle user login
 * @param {String} email - Email of the user
 * @param {String} password - Password of the user
 * @swagger
 * /auth/login:
 *  post:
 *    tags:
 *    - Auth
 *    summary: Handle user login
 *    parameters:
 *    - in: body
 *      name: email
 *      schema:
 *        type: string
 *      required: true
 *      description: Email of the user
 *    - in: body
 *      name: password
 *      schema:
 *        type: string
 *      required: true
 *      description: Password of the user
 *    responses:
 *      200:
 *       description: Successfully login
 *      211:
 *        description: Email or password invalid
 *      225:
 *        description: Company invalid
 *      215:
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
 *      500:
 *        description: Internal server error
 */
router.post('/login',
    // Check if email is valid
    body('email').isEmail().withMessage('Please enter a valid email address'),
    // Check password is not undefined
    body('password').exists().withMessage('Please enter a password'),
    global.checkForErrors,
    async function (req, res) {
        let data = req.body;
        try {
            let user = await User.getByEmail(data.email);

            if (!user) {
                res.status(211).send('Email or password invalid');
                return;
            }

            if (user.isCompany()) {
                let company = await Company.getById(user.company);
                if (company.valid === null) {
                    res.status(225).send('Wait for admin approval.');
                    return;
                }

                if (!company.valid) {
                    res.status(225).send('Your aplication has been reject.');
                    return;
                }
            }

            if (bcrypt.compareSync(data.password, user.password)) {
                let sessionId = createid(64);
                req.session.userid = user.id;
                req.session.email = user.email;
                req.session.sessionId = sessionId;
                user.sessionId = sessionId;
                let sessionSave = req.session.save();
                let userSave = user.update();

                Promise.all([sessionSave, userSave]).then(() => {
                    res.status(200).send({ id: user.id });
                }).catch((err) => {
                    console.log(err)
                    res.sendStatus(500);
                });
            } else {
                res.status(211).send('Email or password invalid');
            }
        } catch (error) {
            console.log(error)
            res.sendStatus(500);
        }
    });

/**
 * @function
 * @route {POST} /validate
 * @description Validates the user session and sends information about the user
 * @swagger
 * /auth/validate:
 *   post:
 *     summary: Validate the user session and retrieve user information
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successful validation
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 isAuth:
 *                   type: boolean
 *                 isAdmin:
 *                   type: boolean
 *                 isProfessional:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
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
 *       500:
 *         description: Server error
 */
router.post('/validate', async function (req, res) {
    if (req.session.userid) {
        try {
            let user = await User.getById(req.session.userid);
            if (user
                && user.sessionId === req.session.sessionId
                && user.email === req.session.email) {
                req.session.touch();
                res.status(200).send({ isAuth: true, isAdmin: user.admin, isProfessional: user.isProfessional() })
            } else {
                await req.session.destroy();
                res.status(200).send({ isAuth: false })
            }
        } catch (error) {
            console.log(error)
            res.sendStatus(500);
        }
    } else {
        res.status(200).send({ isAuth: false })
    }
});

/**
 * @function
 * @route {GET} /logout
 * @description Handle user logout
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Handle user logout
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successful logout
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
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
 *       500:
 *          description: Internal server error
 */
router.post('/logout', async function (req, res) {
    try {
        if (req.session.userid) {
            let user = await User.getById(req.session.userid);

            if (user) {
                user.sessionId = 'expired';

                Promise.all([user.update(), req.session.destroy()])
                    .then(() => {
                        res.status(200).send(true)
                    }).catch(err => {
                        console.log(err)
                        res.sendStatus(500);
                    });
            } else {
                res.status(200).send(false)
            }
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500);
    }
})

module.exports = router;