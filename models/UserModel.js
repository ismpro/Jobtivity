const DB = require('../config/connection')

class User {

    constructor(obj) {
        if (!obj)
            return
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

    isCompany() {
        return !!this.company;
    }

    isProfissional() {
        return !!this.profissional;
    }

    async exists() {
        const query = await DB.pool.query(`select idUser FROM User where idUser=${this.id}`);
        return query[0].length !== 0;
    }

    async existsByEmail() {
        const query = await DB.pool.query(`select email FROM User where email='${this.email}'`);
        return query[0].length !== 0;
    }

    /* async update() {
        await DB.pool.query(`
            UPDATE User SET
            email = ${this.email},
            password = ${this.password}>,
            name = ${this.name},
            description = ${this.description},
            admin = ${this.admin === true ? 1 : 0},
            WHERE idUser=${this.id};
        `);
        return;
    } */

    async updateSessionId() {
        await DB.pool.query(`
            UPDATE User SET
            sessionId = '${this.sessionId}'
            WHERE idUser=${this.id};
        `);
        return;
    }

    async create() {
        let user = await DB.pool.query(`
            INSERT INTO User 
            (email, password, name, description, admin, companyId, profissionalId)
            VALUES ('${this.email}', '${this.password}', '${this.name}', '${this.description}', ${this.admin === true ? 1 : 0}, ${this.company ? this.company : null}, ${this.profissional ? this.profissional : null});
        `);
        this.id = user[0].insertId;
        return user[0].insertId;
    }

    static async getByEmail(email) {
        if (email) {
            try {
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId, profissionalId FROM User where email='${email}'`);
                if(query.length === 0) return null;
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

    static async getById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId, profissionalId FROM User where idUser=${id}`);
                if(query.length === 0) return null;
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

    static async getCompanyById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, sessionId, companyId, profissionalId FROM User where companyId=${id}`);
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
    
    /*

    static async getAll() {
        let pessoas = [];
        try {
            const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin FROM User`);
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

module.exports = User;