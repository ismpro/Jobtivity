let { Router } = require("express");
let router = Router();

const User = require("../models/UserModel")

router.post('/register', function (req, res) {
    console.log(req.body);

    let user = new User();
});

module.exports = router;