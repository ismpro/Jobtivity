/**
 * @file Express router for handling job related routes
 * @module routes/api
 */

let { Router } = require("express");
let router = Router();
const fs = require('fs');
const path = require("path");

/**
 * @function
 * @route {GET} /api/jobs
 * @description Retrieves the list of jobs from the local file system
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Retrieves the list of jobs from the local file system
 *     responses:
 *       200:
 *         description: Successfully retrieved list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get('/jobs', function (req, res) {
    let p = path.resolve('./jobs.json');
    let data = fs.readFileSync(p)
    res.status(200).send(JSON.parse(data))
})

module.exports = router;