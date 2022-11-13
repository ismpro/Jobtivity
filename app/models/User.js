const pool = require("./connection");

class User {

    constructor(obj) {
        if (!obj)
            return
        this.id = obj.id
    }

    async save() {
        let info = pool.query(`INSERT INTO tratamento (trat_uti, trat_pac_id, trat_tp_trat_id, trat_loc_id, trat_pac_med_id) VALUES('${this.uti}', '${this.paciente}', '${this.tipo}','${this.location}','${this.medico}')`);
        let data = await Promise.all([Medico.getOneById(this.medico), Paciente.getOneById(this.paciente), TipoTratamento.getOneById(this.tipo), Local.getOneById(this.location)])
        this.location = data[3]
        this.paciente = data[1]
        this.medico = data[0].medico
        this.tipo = data[2]
        return info.insertId
    }

    async create() {
        let info = pool.query(`INSERT INTO tratamento (trat_uti, trat_pac_id, trat_tp_trat_id, trat_loc_id, trat_pac_med_id) VALUES('${this.uti}', '${this.paciente}', '${this.tipo}','${this.location}','${this.medico}')`);
        let data = await Promise.all([Medico.getOneById(this.medico), Paciente.getOneById(this.paciente), TipoTratamento.getOneById(this.tipo), Local.getOneById(this.location)])
        this.location = data[3]
        this.paciente = data[1]
        this.medico = data[0].medico
        this.tipo = data[2]
        return info.insertId
    }

    static async getOneById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                let query = await pool.query(`SELECT trat_id"id", trat_uti"uti", trat_tp_trat_id"tp_id", trat_loc_id"loc_id", trat_pac_med_id"med_id", trat_pac_id"pac_id" FROM tratamento WHERE trat_id = ${id}`);
                let data = await Promise.all([Medico.getOneById(query[0].med_id), Paciente.getOneById(query[0].pac_id), TipoTratamento.getOneById(query[0].tp_id), Local.getOneById(query[0].loc_id)])
                let location = data[3]
                let paciente = data[1]
                let medico = data[0].medico
                let tipo = data[2]
                let tratamento = new Tratamento({
                    id: query[0].id,
                    uti: query[0].uti,
                    tipo: tipo,
                    location: location,
                    medico: medico,
                    paciente: paciente
                })
                return tratamento
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
        let tratamentos = []
        try {
            let query = await pool.query(`SELECT trat_id"id", trat_uti"uti", trat_tp_trat_id"tp_id", trat_loc_id"loc_id", trat_pac_med_id"med_id", trat_pac_id"pac_id" FROM tratamento`);
            for (const element of query) {
                let data = await Promise.all([Medico.getOneById(element.med_id), Paciente.getOneById(element.pac_id), TipoTratamento.getOneById(element.tp_id), Local.getOneById(element.loc_id)])
                let location = data[3]
                let paciente = data[1]
                let medico = data[0].medico
                let tipo = data[2]
                tratamentos.push(new Tratamento({
                    id: element.id,
                    uti: element.uti,
                    tipo: tipo,
                    location: location,
                    medico: medico,
                    paciente: paciente
                }))
            }
            return tratamentos
        } catch (err) {
            console.log(err);
            return err
        }
    }
}


module.exports = Tratamento;