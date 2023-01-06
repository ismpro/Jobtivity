const { Router } = require("express");
const router = Router();

const Company = require("../models/CompanyModel");
const User = require("../models/UserModel");

router.post('/alterValid', async function (req, res) {
    let data = req.body;

    let company = await Company.getById(data.id);

    if (data.type === "accept") {
        company.valid = true;
    } else if (data.type === "reject") {
        company.valid = false;
    }

    await company.update();

    res.status(200).send(true);
});

router.get('/list', async function (req, res) {

    let output = [];

    let companies = await Company.getAllByValidNull();

    for (const company of companies) {
        let user = await User.getCompanyById(company.id);
        output.push({
            idCompany: company.id,
            name: user.name,
            description: user.description,
            logo: company.urlLogo,
            url: company.urlWebsite
        })
    }

    res.status(200).send(output);
})


module.exports = router;