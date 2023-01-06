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
            VALUES ('${this.urlWebsite}', '${this.urlLogo}', ${this.valid === void 0 ? null : this.valid === true ? 1 : 0});`);
            this.id = company[0].insertId;
            return company[0].insertId;
        } catch (error) {
            console.log(error)
        }
    }

    async update() {
        await DB.pool.query(`
            UPDATE Company SET
            urlWebsite = '${this.urlWebsite}',
            urlLogo = '${this.urlLogo}',
            valid = ${this.valid ? 1 : 0}
            WHERE idCompany=${this.id};
        `);
        return;
    }

    /**
     * 
     * @param {Number} id 
     * @returns 
     */
    static async getById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idCompany"id", urlWebsite, urlLogo, valid FROM Company where idCompany=${id}`);
                if(query.length === 0) return null;
                return new Company({
                    ...query[0],
                    valid: query[0].valid === 1
                });
            } catch (err) {
                console.log(err);
                throw err
            }
        } else {
            console.log("Invalid id");
            throw "Invalid id"
        }
    }

    static async getAllByValidNull() {
        /**
         * @type {Company[]}
         */
        let companies = [];
        try {
            const [query] = await DB.pool.query(`select idCompany"id", urlWebsite, urlLogo, valid FROM Company where valid is null`);
            for (const element of query) {
                companies.push(new Company({
                    ...element,
                    valid: element.valid === null ? null : element.valid === 1
                }))
            }
            return companies;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    /* 
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