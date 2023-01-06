let DB = require('../config/connection');

class Company{

    constructor(obj) {
        if (!obj)
            return;
        this.id = obj.id
        this.urlWebsite = obj.urlWebsite
        this.urlLogo = obj.urlLogo
        this.valid = obj.valid
    }

    async create() {
        try {
            let company = await DB.pool.query(`
            INSERT INTO Company (urlWebsite, urlLogo, valid)
            VALUES ('${this.urlWebsite}', '${this.urlLogo}', ${this.valid === true ? 1 : 0});`);
            this.id = company[0].insertId;
            return company[0].insertId;
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * 
     * @param {Number} id 
     * @returns 
     */
    static async getById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idCompany"id", urlWebsite, urlLogo, valid FROM User where idCompany=${id}`);
                if(query.length === 0) return null;
                return new Company({
                    ...query[0],
                    valid: query[0].valid === 1
                });
            } catch (err) {
                console.log(err);
                return err
            }
        } else {
            console.log("Invalid id");
            return "Invalid id"
        }
    }

    /* async update() {
        await DB.pool.query(`
            UPDATE User SET
            email = ${this.email},
            password = ${this.password}>,
            name = ${this.name},
            description = ${this.description},
            admin = ${this.admin === true ? 1 : 0},
            companyId = ${this.company ? this.company.id : null},
            profissionalId = ${this.profissional ? this.profissional.id : null}
            WHERE idUser=${this.id};
        `);
        return;
    }

    

    static async getAll() {
        let pessoas = [];
        try {
            const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, companyId, profissionalId FROM User`);
            for (const element of query) {
                pessoas.push(new User({
                    ...element,
                }))
            }
            return pessoas
        } catch (err) {
            console.log(err);
            return err
        }
    } */
}

module.exports = Company;