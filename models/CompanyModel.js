let DB = require('../config/connection');

/**
 * A class representing a company.
 */
class Company {
    /**
     * Creates a new Company instance.
     * @param {Object} obj - The properties of the Company.
     * @param {number} obj.id - The ID of the company.
     * @param {string} obj.urlWebsite - The URL of the company's website.
     * @param {string} obj.urlLogo - The URL of the company's logo.
     * @param {boolean} obj.valid - Whether the company is valid or not.
     */
    constructor(obj) {
        if (!obj) return;
        this.id = obj.id
        this.urlWebsite = obj.urlWebsite
        this.urlLogo = obj.urlLogo
        this.valid = obj.valid
    }

    /**
     * Creates a new company in the database.
     * @returns {Promise<number>} - The ID of the newly created company.
     */
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

    /**
     * Updates an existing company in the database.
     * @returns {Promise}
     */
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
     * Gets a company from the database by its ID.
     * @param {number} id - The ID of the company to retrieve.
     * @returns {Promise<Company|null>} - The company with the specified ID, or null if no such company exists.
     */
    static async getById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idCompany"id", urlWebsite, urlLogo, valid FROM Company where idCompany=${id}`);
                if (query.length === 0) return null;
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

    /**
   * Gets all companies from the database where the `valid` field is null.
   * @returns {Promise<Company[]>} - An array of companies with a null `valid` field.
   */
    static async getAllByValidNull() {
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
}
module.exports = Company;