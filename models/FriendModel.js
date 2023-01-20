let DB = require('../config/connection');

/**
 * Friend represents a friend request or relationship between two professionals
 * @class
 */
class Friend {

    /**
     * Creates a new Friends object
     * @constructor
     * @param {Object} obj - The object with which to create the Friends object
     * @param {Number} obj.id - The id of the Friends object
     * @param {Number} obj.professional1 - The id of the first professional in the friend relationship
     * @param {Number} obj.professional2 - The id of the second professional in the friend relationship
     * @param {Date} obj.since - The date the friend relationship was created
     */
    constructor(obj) {
        if (!obj) return;
        this.id = obj.id
        this.professional1 = obj.professional1
        this.professional2 = obj.professional2
        this.since = obj.since
    }

    /**
     * Creates a new friend relationship in the database
     * @returns {Promise<Number>} - The id of the newly created friend relationship
     */
    async create() {
        try {
            let query = await DB.pool.query(`
            INSERT INTO Friend (idProfessional1, idProfessional2, since)
            VALUES (?, ?, STR_TO_DATE(?, "%Y-%m-%d"));`,
                [this.professional1, this.professional2, this.since.toISOString().split("T")[0]]);

            this.id = query[0].insertId;
            return query[0].insertId;
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Deletes a friend from the database.
     *
     * @return {Promise<void>} - Resolves once the deletion is complete.
     */
    async delete() {
        await DB.pool.query(`DELETE FROM Friend WHERE idFriend=?;`, [this.id]);
        this.id = null;
        return;
    }

    /**
     * Retrieves a friend by its ID from the database.
     *
     * @static
     * @param {Number} id - The ID of the friend to retrieve.
     * @return {Promise<Friend|null>} - A promise that resolves to the retrieved friend or null if no request is found.
     */
    static async getById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idFriend"id", idProfessional1"professional1", idProfessional2"professional2", since 
                                                    FROM Friend where idFriend=?`, [id]);
                if (query.length === 0) return null;
                return new Friend({
                    ...query[0],
                    since: new Date(query[0].since)
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
     * Gets all friend relationships for a given user
     * @param {Number} id - The id of the user
     * @returns {Promise<Array<Friend>>} - An array of Friends objects representing the friend relationships
     * @throws {String} - If the id is invalid.
     */
    static async getAllForProfessional(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                let output = [];
                const [query] = await DB.pool.query(`select idFriend"id", idProfessional1"professional1", idProfessional2"professional2", since 
                                      FROM Friend where idProfessional1=? or idProfessional2=?`, [id, id]);
                for (const element of query) {
                    output.push(new Friend({ ...element, since: new Date(element.since) }))
                }
                return output;
            } catch (err) {
                console.log(err);
                throw err;
            }
        } else {
            console.log("Invalid id");
            throw "Invalid id"
        }
    }
}

module.exports = Friend;
