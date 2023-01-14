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
 * @route {GET} /jobs
 * @description Retrieves the list of jobs from the local file system
 */
router.get('/jobs', function (req, res) {
    let p = path.resolve('./jobs.json');
    let data = fs.readFileSync(p)
    res.send(JSON.parse(data))
})

module.exports = router;