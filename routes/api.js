let { Router } = require("express");
let router = Router();
const fs = require('fs');
const path = require("path");

router.get('/jobs', function (req, res) {
    let p = path.resolve('./jobs.json');
    let data = fs.readFileSync(p)
    res.send(JSON.parse(data))
})

module.exports = router;