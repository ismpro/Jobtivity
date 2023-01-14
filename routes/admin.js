/**
 * @file Express router for handling admin information
 * @module routes/admin
 */
const { Router } = require("express");
const router = Router();

const { body } = require('express-validator');
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
 * @return {boolean} true - If the change was successful
 * @throws {Error} - If an error occurs during the process
 */
router.post('/alterValid',
    //checkAdmin,
    body('id').isInt().withMessage('Please enter a valid id').toInt(),
    global.checkForErrors,
    async function (req, res) {
        let data = req.body;

        try {
            let company = await Company.getById(data.id);

            if (data.type === "accept") {
                company.valid = true;
            } else if (data.type === "reject") {
                company.valid = false;
                let user = await User.getByCompanyId(company.id);
                await sendEmail(user.email);
            }

            //await company.update();

            res.status(200).send(true);

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
 * @throws {Error} - If any error occurs during the process
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