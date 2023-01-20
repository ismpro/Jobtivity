/**
 * @file Express router for handling admin information
 * @module routes/admin
 */
const { Router } = require("express");
const router = Router();

const { body, validationResult } = require('express-validator');
const sendEmail = require("../app/mail");

const Company = require("../models/CompanyModel");
const User = require("../models/UserModel");

/**
 * Checks if the currently authenticated user is an administrator.
 * If not, returns HTTP status code 401 (unauthorized).
 *
 * @param {e.Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {function} next - Function that passes control to the next middleware
 */
const checkAdmin = async function (req, res, next) {
    if (req.session.userid) {
        try {
            let user = await User.getById(req.session.userid);

            if (user
                && user.sessionId === req.session.sessionId
                && user.email === req.session.email
                && user.admin) {
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
}

/**
 * Route that allows you to change the validation status of a company.
 * Accessible only to administrators.
 * @route {POST} /alterValid
 * @param {string} id - ID of the company you wish to change the validation status of
 * @param {string} type - Type of change you wish to make ('accept' or 'reject')
 * @swagger
 * /admin/alterValid:
 *  post:
 *    tags:
 *    - Admin
 *    summary: Change the validation status of a company
 *    parameters:
 *    - in: body
 *      name: id
 *      schema:
 *        type: integer
 *      required: true
 *      description: ID of the company you wish to change the validation status of
 *    - in: body
 *      name: type
 *      schema:
 *        type: string
 *        enum: [accept, reject]
 *      required: true
 *      description: Type of change you wish to make
 *    responses:
 *      200:
 *        description: Changed successfully
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
 *      400:
 *        description: Company doesn't exist 
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal Server Error
 */
router.post('/alterValid',
    checkAdmin,
    body('id').isInt().withMessage('Please enter a valid id').toInt(),
    body('type').isIn(['accept', 'reject']).withMessage('Type must be either M or F'),
    global.checkForErrors,
    async function (req, res) {
        try {
            let company = await Company.getById(req.body.id);

            if(!company) {
                return res.status(400).send("Company doesn't exist")
            }

            if (req.body.type === "accept") {
                company.valid = true;
            } else if (req.body.type === "reject") {
                company.valid = false;
                let user = await User.getByCompanyId(company.id);
                await sendEmail(user.email);
            }

            await company.update();

            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    });

/**
 * Route that returns a list of companies that have not yet been validated.
 * Accessible only to administrators.
 * 
 * @route {GET} /list
 * @return {Array<{idCompany: Number, name: String, description: String, logo: String, url: String}>} output - List of companies
 * @swagger
 * /admin/list:
 *   get:
 *     tags:
 *     - Admin
 *     summary: Returns a list of companies that have not yet been validated.
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   idCompany:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   logo:
 *                     type: string
 *                   url:
 *                     type: string
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
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/list', checkAdmin, async function (req, res) {

    let output = [];
    try {
        let companies = await Company.getAllByValidNull();

        for (const company of companies) {
            let user = await User.getByCompanyId(company.id);
            output.push({
                idCompany: company.id,
                name: user.name,
                description: user.description,
                logo: company.urlLogo,
                url: company.urlWebsite
            })
        }
        res.status(200).send(output);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

module.exports = router;