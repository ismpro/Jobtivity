let DB = require('../config/connection')
const User = require("./UserModel");

class Professional extends User {

    constructor(obj) {
        if (!obj)
            return;
        super(obj);
        this.id = obj.id
        this.birthday = obj.birthday
        this.gender = obj.gender
        this.local = obj.local
        this.private = obj.private
        this.user = obj.user
    }

    async create() {
        try {
            let professional = await DB.pool.query(`
            INSERT INTO Profissional
            (birthday, gender, local, private, idUser)
            VALUES (STR_TO_DATE('${this.birthday}', "%Y-%m-%d"), '${this.gender}', '${this.local}', ${this.private === true ? 1 : 0}, ${this.user});
        `);
            this.id = professional.insertId;
            return professional.insertId;
        } catch (error) {
            console.log(error)
        }
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

module.exports = Professional;