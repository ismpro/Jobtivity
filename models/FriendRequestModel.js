let DB = require('../config/connection');

/**
 * Class for handling friend requests between professionals.
 *
 * @class
 */
class FriendsRequests {

    /**
     * Initializes properties of a friend request object.
     *
     * @constructor
     * @param {Object} obj - The friend request object.
     * @param {Number} obj.id - The ID of the friend request.
     * @param {Number} obj.professional1 - The ID of the first professional involved in the request.
     * @param {Number} obj.professional2 - The ID of the second professional involved in the request.
     * @param {Date} obj.timestamp - The timestamp of when the request was made.
     */
    constructor(obj) {
        if (!obj) return;
        this.id = obj.id
        this.profissional1 = obj.profissional1
        this.profissional2 = obj.profissional2
        this.timestamp = obj.timestamp
    }

    /**
     * Creates a new friend request in the database.
     *
     * @return {Promise<number>} - The ID of the newly created friend request.
     */
    async create() {
        try {
            let query = await DB.pool.query(`
            INSERT INTO FriendRequest (idProfessional1, idProfessional2, timestamp)
                VALUES (?, ?, STR_TO_DATE(?, '%Y-%m-%d  %H:%i:%s'));`,
                [this.profissional1, this.profissional2, this.timestamp.toISOString().slice(0, 19).replace('T', ' ')]);
            this.id = query[0].insertId;
            return query[0].insertId;
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Deletes a friend request from the database.
     *
     * @return {Promise<void>} - Resolves once the deletion is complete.
     */
    async delete() {
        try {
            await DB.pool.query(`DELETE FROM FriendRequest WHERE idFriendRequest=?;`, [this.id]);
            this.id =  null;
            return;
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Retrieves a friend request by its ID from the database.
     *
     * @static
     * @param {Number} id - The ID of the friend request to retrieve.
     * @return {Promise<FriendsRequests|null>} - A promise that resolves to the retrieved friend request or null if no request is found.
     */
    static async getById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idFriendRequest"id", idProfessional1"professional1", idProfessional2"professional2", timestamp 
                                                    FROM FriendRequest where idFriendsRequests=?`, [id]);
                if (query.length === 0) return null;
                return new FriendsRequests({
                    ...query[0],
                    timestamp: new Date(query[0].timestamp)
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
     * Retrieves all friend requests where the second professional has the specified ID.
     *
     * @static
     * @param {Number} id - The ID of the second professional.
     * @return {Promise<Array<FriendsRequests>|null>} - A promise that resolves to an array of retrieved friend requests or null if no requests are found.
     */
    static async getAllByProfessional2Id(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                let output = [];
                const [query] = await DB.pool.query(`select idFriendRequest"id", idProfessional1"professional1", idProfessional2"professional2", timestamp 
                                            FROM FriendRequest where idProfessional2=?`, [id]);
                if (query.length === 0) return null;
                for (const element of query) {
                    output.push(new FriendsRequests({
                        ...element,
                        timestamp: new Date(element.timestamp)
                    }));
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

module.exports = FriendsRequests;