let DB = require('../app/db')

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
        this.company = obj.company
        this.profissional = obj.profissional
    }

    async update() {
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

    async create() {
        let user = await DB.pool.query(`
            INSERT INTO User 
            (email, password, name, description, admin, companyId, profissionalId)
            VALUES (${this.email}, ${this.password}, ${this.name}, ${this.description}, ${this.admin === true ? 1 : 0}, 
            ${this.company ? this.company.id : null},${this.profissional ? this.profissional.id : null});
        `);
        this.id = user.insertId;
        return user.insertId
    }

    static async getById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, companyId, profissionalId FROM User where idUser=${id}`);
                /* let data = await Promise.all([Company.getOneById(query[0].companyId), Profissional.getOneById(query[0].profissionalId)])
                let company = data[1]
                let profissional = data[0] */
                return new User({
                    ...query[0],
                    /* company,
                    profissional */
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

    static async getAll() {
        let pessoas = [];
        try {
            const [query] = await DB.pool.query(`select idUser"id", email, password, name, description, admin, companyId, profissionalId FROM User`);
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