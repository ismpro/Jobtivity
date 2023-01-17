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
 * Route that returns a list of companies that have been validated.
 * 
 * @route {GET} /list
 * @return {Array<{idCompany: Number, name: String, description: String, logo: String, url: String}>} output - List of companies
 * @swagger
 * /admin/list:
 *   get:
 *     tags:
 *     - Admin
 *     summary: Returns a list of companies that have been validated.
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
router.get('/list', async function (req, res) {

    let output = [];
    try {
        let companies = await Company.getAllCompanies();

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