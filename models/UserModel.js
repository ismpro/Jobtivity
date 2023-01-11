const DB = require('../config/connection')
const Professional = require('../models/ProfessionalModel');

/**
 * A class representing a user.
 * @class
 */
class User {
    /**
     * Creates a new User instance.
     * @param {Object} obj - The properties of the User.
     * @param {Number} obj.id - The ID of the user.
     * @param {String} obj.email - The email of the user.
     * @param {String} obj.password - The password of the user.
     * @param {String} obj.name - The name of the user.
     * @param {String} obj.description - The description of the user.
     * @param {Boolean} obj.admin - Whether the user is an admin or not.
     * @param {String} obj.sessionId - The session ID of the user.
     * @param {Number} obj.company - The ID of the company associated with the user.
     * @param {Number} obj.professional - The ID of the professional associated with the user.
     */
    constructor(obj) {
        if (!obj) return;
        this.id = obj.id
        this.email = obj.email
        this.password = obj.password
        this.name = obj.name
        this.description = obj.description
        this.admin = obj.admin
        this.sessionId = obj.sessionId
        this.company = obj.company
        this.professional = obj.professional
    }

    /**
     * Returns whether the user is a company or not.
     * @returns {Boolean} - `true` if the user is a company, `false` otherwise.
     */
    isCompany() {
        return !!this.company;
    }

    /**
     * Returns whether the user is a professional or not.
     * @returns {Boolean} - `true` if the user is a professional, `false` otherwise.
     */
    isProfessional() {
        return !!this.professional;
    }

    /**
     * Creates a new user in the database.
     * @returns {Promise<Number>} - The ID of the newly created user.
     */
    async create() {
        let user = await DB.pool.query(`
            INSERT INTO User 
            (email, password, name, description, admin, companyId, professionalId)
            VALUES ('${this.email}', '${this.password}', '${this.name}', '${this.description}', ${this.admin === true ? 1 : 0}, ${this.company ? this.company : null}, ${this.professional ? this.professional : null});
        `);
        this.id = user[0].insertId;
        return user[0].insertId;
    }

    static async update(id, data) {
        let query = `UPDATE User SET name = ?, Description = ? WHERE professionalId = ?`;
        let values = [data.name, data.description, id];
        let query2 = `UPDATE Professional SET local = ? WHERE idProfessional = ?`;
        let values2 = [data.local, id];
        let results = await DB.pool.query(query, values) && await DB.pool.query(query2, values2);
        console.log(results);
        return results;
    }

    /**
     * Updates the sessionId of the user in the database.
     *
     * @returns {Promise} - Promise that resolves when the update is complete.
     */
    async updateSessionId() {
        await DB.pool.query(`
        UPDATE User SET
        sessionId = '${this.sessionId}'
        WHERE idUser=${this.id};
    `);
        return;
    }

    /**
    * Check if a user with the specified email exists in the database.
    *
    * @param {String} email - Email of the user to check for.
    * @returns {Promise<Boolean>} - Promise that resolves with a Boolean indicating whether a user with the specified email exists.
    */
    static async existsByEmail(email) {
        const query = await DB.pool.query(`select email FROM User where email='${email}'`);
        return query[0].length !== 0;
    }

    /**
    * Get a user from the database with the specified email.
    *
    * @param {String} email - Email of the user to get.
    * @returns {Promise<User>} - Promise that resolves with a User object or null if no user was found with the specified email.
    * @throws {String} - If the email is invalid.
    */
    static async getByEmail(email) {
        if (email) {
            try {
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId"company", professionalId"professional" 
                                                        FROM User where email='${email}'`);
                if (query.length === 0) return null;
                return new User({...query[0], valid: query[0].admin === 1});
            } catch (err) {
                console.log(err);
                throw err;
            }
        } else {
            console.log("Invalid email");
            throw "Invalid email";
        }
    }

    static async getProfessionalsBySearchEmail(text) {
        if (text) {
            let users = [];
            try {
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId"company", professionalId"professional" 
                                                        FROM User where email like '%${text}%' and professionalId is not null`);
                if (query.length === 0) return null;
                for (const element of query) {
                    users.push(new User({...element, valid: element.admin === 1}));
                }
                return users;
            } catch (err) {
                console.log(err);
                throw err;
            }
        } else {
            console.log("Invalid email");
            throw "Invalid email";
        }
    }

    /**
    * Get a user from the database with the specified id.
    *
    * @param {Number} id - ID of the user to get.
    * @returns {Promise<User>} - Promise that resolves with a User object or null if no user was found with the specified id.
    * @throws {String} - If the id is invalid.
    */
    static async getById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId"company", professionalId"professional" 
                                                        FROM User where idUser=${id}`);
                if (query.length === 0) return null;
                return new User({...query[0], valid: query[0].admin === 1});
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
     * Get a user from the database with the specified company id.
     *
     * @param {Number} id - ID of the company the user belongs to.
     * @returns {Promise<User>} - Promise that resolves with a User object or null if no user was found with the specified company id.
     * @throws {String} - If the id is invalid.
     */
    static async getByCompanyId(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId"company", professionalId"professional" 
                                                        FROM User where companyId=${id}`);
                if (query.length === 0) return null;
                return new User({...query[0], valid: query[0].admin === 1});
            } catch (err) {
                console.log(err);
                throw err
            }
        } else {
            console.log("Invalid id");
            throw "Invalid id"
        }
    }

    static async getByProfessionalId(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId"company", professionalId"professional" 
                                                FROM User where professionalId=${id}`);
                if (query.length === 0) return null;
                return new User({...query[0], valid: query[0].admin === 1});
            } catch (err) {
                console.log(err);
                throw err
            }
        } else {
            console.log("Invalid id");
            throw "Invalid id"
        }
    }

    static async getAllProfessionalsUsers() {
        let professionals = [];
        try {
            const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId"company", professionalId"professional" 
                                                    FROM User where professionalId is not null`);
            for (const element of query) {
                console.log("Elemento: " + element);
                professionals.push(new User({...element, valid: element.admin === 1}));
            }
            return professionals;
        } catch (err) {
            console.log(err);
            throw err
        }
    }
}

module.exports = User;