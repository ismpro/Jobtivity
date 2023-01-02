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
    }

    async exists() {
        const query = await DB.pool.query(`select idUser FROM User where idUser=${this.id}`);
        return query[0].length !== 0;
    }

    async existsByEmail() {
        const query = await DB.pool.query(`select email FROM User where email='${this.email}'`);
        return query[0].length !== 0;
    }

    async update() {
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
    }

    async create() {
        let user = await DB.pool.query(`
            INSERT INTO User 
            (email, password, name, description, admin)
            VALUES ('${this.email}', '${this.password}', '${this.name}', '${this.description}', ${this.admin === true ? 1 : 0});
        `);
        this.id = user[0].insertId;
        return user[0].insertId;
    }

    static async getById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin FROM User where idUser=${id}`);
                /* let data = await Promise.all([Company.getOneById(query[0].companyId), Profissional.getOneById(query[0].profissionalId)])
                let company = data[1]
                let profissional = data[0] */
                return new User(query[0]);
            } catch (err) {
                console.log(err);
                return err
            }
        } else {
            console.log("Invalid id");
            return "Invalid id"
        }
    }

    static async getAll() {
        let pessoas = [];
        try {
            const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin FROM User`);
            for (const element of query) {
                /* let data = await Promise.all([Company.getOneById(element.companyId), Profissional.getOneById(element.profissionalId)])
                let company = data[1]
                let profissional = data[0] */
                pessoas.push(new User({
                    ...element,
                    /* company,
                    profissional */
                }))
            }
            return pessoas
        } catch (err) {
            console.log(err);
            return err
        }
    }
}

module.exports = User;