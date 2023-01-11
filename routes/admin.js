const { Router } = require("express");
const router = Router();

const Company = require("../models/CompanyModel");
const User = require("../models/UserModel");

/**
 * Verifica se o usuário atualmente autenticado é um administrador.
 * Se não for, retorna o código de status HTTP 401 (não autorizado).
 *
 * @param {e.Request} req - Objeto de requisição do express
 * @param {Response} res - Objeto de resposta do express
 * @param {function} next - Função que passa o controle para o próximo middleware
 */
const checkAdmin = async function (req, res, next) {
    if (req.session.userid) {
        try {
            let user = await User.getById(req.session.userid);

            if (user && user.sessionId === req.session.sessionId && user.admin) {
                next();
            } else {
                res.sendStatus(401);
            }
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.sendStatus(401);
    }
}

/**
 * Rota que permite alterar o estado de validação de uma empresa.
 * Acessível apenas para administradores.
 *
 * @param {string} id - ID da empresa que deseja alterar o estado de validação
 * @param {string} type - Tipo de alteração que deseja realizar ('accept' ou 'reject')
 * @return {boolean} true - Se a alteração foi realizada com sucesso
 * @throws {Error} - Se ocorrer algum erro durante o processo
 */
router.post('/alterValid', checkAdmin, async function (req, res) {
    let data = req.body;

    try {
        let company = await Company.getById(data.id);

        if (data.type === "accept") {
            company.valid = true;
        } else if (data.type === "reject") {
            company.valid = false;
        }

        await company.update();

        res.status(200).send(true);

    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * Rota que retorna uma lista de empresas que ainda não foram validadas.
 * Acessível apenas para administradores.
 *
 * @return {Array<{idCompany: Number, name: String, description: String, logo: String, url: String}>} output - Lista de empresas
 * @throws {Error} - Se ocorrer algum erro durante o processo
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
        console.log(error)
        res.status(500).send(error);
    }
})

module.exports = router;