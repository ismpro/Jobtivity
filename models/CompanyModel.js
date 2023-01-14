let DB = require('../app/connection');

/**
 * A class representing a company.
 * @class
 */
class Company {
    /**
     * Creates a new Company instance.
     * @param {Object} obj - The properties of the Company.
     * @param {Number} obj.id - The ID of the company.
     * @param {String} obj.urlWebsite - The URL of the company's website.
     * @param {String} obj.urlLogo - The URL of the company's logo.
     * @param {Boolean} obj.valid - Whether the company is valid or not.
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
     * @returns {Promise<Number>} - The ID of the newly created company.
     */
    async create() {
        let company = await DB.pool.query(`
                    INSERT INTO Company (urlWebsite, urlLogo, valid)
                    VALUES (?, ?, ?);`,
            [this.urlWebsite, this.urlLogo, this.valid === null ? null : this.valid === true ? 1 : 0]);
        this.id = company[0].insertId;
        return company[0].insertId;
    }

    /**
     * Updates an existing company in the database.
     * @returns {Promise}
     */
    async update() {
        await DB.pool.query(`
        UPDATE Company SET
        urlWebsite = ?,
        urlLogo = ?,
        valid = ?
        WHERE idCompany=?;
    `, [this.urlWebsite, this.urlLogo, this.valid === null ? null : this.valid ? 1 : 0, this.id]);
        return;
    }

    /**
     * Gets a company from the database by its ID.
     * @param {Number} id - The ID of the company to retrieve.
     * @returns {Promise<Company|null>} - The company with the specified ID, or null if no such company exists.
     * @throws {String} - If the id is invalid.
     */
    static async getById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idCompany"id", urlWebsite, urlLogo, valid FROM Company where idCompany=?`, [id]);
                if (query.length === 0) return null;
                console.log(query[0])
                return new Company({
                    ...query[0],
                    valid: query[0].valid === null ? null : query[0].valid === 1
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