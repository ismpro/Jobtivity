let { Router } = require("express");
let router = Router();

router.get('/jobs', function (req, res) {
    const Area = {
        Dev: "Programação",
        Database: "Base de Dados",
        SysAdmin: "Administração de Sistemas"
    };

    res.send([{
        nome: "Deloitte",
        descricao: "Procuramos programador de React que seja bastante bom a tocar flauta de olhos vendados enquanto descasca uma maçã com os dedos dos pés. Oferecemos  remuneração  simpática. Pena é não terem tempo livre para aproveitar o salário.",
        area: Area.Dev,
        duracao: 12,
        valor: 1500,
        validade: new Date("2023-12-31")
    },
    {
        nome: "Siemens",
        descricao: "Analista de dados",
        area: Area.Database,
        duracao: 24,
        valor: 1800,
        validade: new Date("2024-10-31")
    },
    {
        nome: "Closure",
        descricao: "Fazem tudo",
        area: Area.SysAdmin,
        duracao: 45,
        valor: 2000,
        validade: new Date("2024-12-31")
    },
    {
        nome: "Closure",
        descricao: "Fazem tudo so que ao contrario",
        area: Area.Dev,
        duracao: 45,
        valor: 1540,
        validade: new Date("2023-02-23")
    }, {
        nome: "Deloitte",
        descricao: "Procuramos programador de React que seja bastante bom a tocar flauta de olhos vendados enquanto descasca uma maçã com os dedos dos pés. Oferecemos  remuneração  simpática. Pena é não terem tempo livre para aproveitar o salário.",
        area: Area.Dev,
        duracao: 12,
        valor: 1500,
        validade: new Date("2023-12-31")
    },
    {
        nome: "Siemens",
        descricao: "Analista de dados",
        area: Area.Database,
        duracao: 24,
        valor: 1800,
        validade: new Date("2024-10-31")
    },
    {
        nome: "Closure",
        descricao: "Fazem tudo",
        area: Area.SysAdmin,
        duracao: 45,
        valor: 2000,
        validade: new Date("2024-12-31")
    },
    {
        nome: "Closure",
        descricao: "Fazem tudo so que ao contrario",
        area: Area.Dev,
        duracao: 45,
        valor: 1540,
        validade: new Date("2023-02-23")
    }, {
        nome: "Deloitte",
        descricao: "Procuramos programador de React que seja bastante bom a tocar flauta de olhos vendados enquanto descasca uma maçã com os dedos dos pés. Oferecemos  remuneração  simpática. Pena é não terem tempo livre para aproveitar o salário.",
        area: Area.Dev,
        duracao: 12,
        valor: 1500,
        validade: new Date("2023-12-31")
    },
    {
        nome: "Siemens",
        descricao: "Analista de dados",
        area: Area.Database,
        duracao: 24,
        valor: 1800,
        validade: new Date("2024-10-31")
    },
    {
        nome: "Closure",
        descricao: "Fazem tudo",
        area: Area.SysAdmin,
        duracao: 45,
        valor: 2000,
        validade: new Date("2024-12-31")
    },
    {
        nome: "Closure",
        descricao: "Fazem tudo so que ao contrario",
        area: Area.Dev,
        duracao: 45,
        valor: 1540,
        validade: new Date("2023-02-23")
    }, {
        nome: "Deloitte",
        descricao: "Procuramos programador de React que seja bastante bom a tocar flauta de olhos vendados enquanto descasca uma maçã com os dedos dos pés. Oferecemos  remuneração  simpática. Pena é não terem tempo livre para aproveitar o salário.",
        area: Area.Dev,
        duracao: 12,
        valor: 1500,
        validade: new Date("2023-12-31")
    },
    {
        nome: "Siemens",
        descricao: "Analista de dados",
        area: Area.Database,
        duracao: 24,
        valor: 1800,
        validade: new Date("2024-10-31")
    },
    {
        nome: "Closure",
        descricao: "Fazem tudo",
        area: Area.SysAdmin,
        duracao: 45,
        valor: 2000,
        validade: new Date("2024-12-31")
    },
    {
        nome: "Closure",
        descricao: "Fazem tudo so que ao contrario",
        area: Area.Dev,
        duracao: 45,
        valor: 1540,
        validade: new Date("2023-02-23")
    }])
})

module.exports = router;