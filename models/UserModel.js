const DB = require('../config/connection')

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
     * @param {Number} obj.profissional - The ID of the professional associated with the user.
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
        this.profissional = obj.profissional
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
    isProfissional() {
        return !!this.profissional;
    }

    /**
     * Creates a new user in the database.
     * @returns {Promise<Number>} - The ID of the newly created user.
     */
    async create() {
        let user = await DB.pool.query(`
            INSERT INTO User 
            (email, password, name, description, admin, companyId, profissionalId)
            VALUES ('${this.email}', '${this.password}', '${this.name}', '${this.description}', ${this.admin === true ? 1 : 0}, ${this.company ? this.company : null}, ${this.profissional ? this.profissional : null});
        `);
        this.id = user[0].insertId;
        return user[0].insertId;
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
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId"company", profissionalId"profissional" FROM User where email='${email}'`);
                if (query.length === 0) return null;
                return new User(query[0]);
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
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId"company", profissionalId"profissional" FROM User where idUser=${id}`);
                if (query.length === 0) return null;
                return new User(query[0]);
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
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId"company", profissionalId"profissional" FROM User where companyId=${id}`);
                if (query.length === 0) return null;
                return new User(query[0]);
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
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId"company", profissionalId"profissional" FROM User where profissionalId=${id}`);
                if (query.length === 0) return null;
                return new User(query[0]);
            } catch (err) {
                console.log(err);
                throw err
            }
        } else {
            console.log("Invalid id");
            throw "Invalid id"
        }
    }

}

module.exports = User;