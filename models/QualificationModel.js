let DB = require("../config/connection");

/**
 * A class representing a PastJob.
 * @class
 */
class Qualification {
  /**
   * Creates a new PastJob instance.
   * @param {Object} obj - The properties of the PastJob.
   * @param {Number} obj.id -
   * @param {String} obj.name -
   * @param {String} obj.url -
   * @param {Date} obj.beginDate -
   * @param {Date} obj.endDate -
   * @param {String} obj.description -
   * @param {Number} obj.idProfessional -
   */
  constructor(obj) {
    if (!obj) return;
    this.id = obj.id;
    this.name = obj.name;
    this.local = obj.local;
    this.type = obj.type;
    this.grade = obj.grade;
    this.professional = obj.professional;
  }

  /**
   * Creates a new PastJob in the database.
   * @returns {Promise<Number>} - The ID of the newly created professional.
   */
  async create() {
    try {
      let qualification = await DB.pool.query(`
      INSERT INTO Qualification (name, local, type, grade, idProfissional)
      VALUES ('${this.name}', '${this.local}', '${this.type}', '${this.grade}', '${this.professional}');`);
      this.id = qualification[0].insertId;
      return qualification[0].insertId;
    } catch (error) {
      console.log(error);
    }
  }

  static async getQualificationById(id) {
    let qualifications = [];
    try {
      const [query] = await DB.pool.query(
        `SELECT idQualification"id", local, name, type, grade, idProfissional"professional" FROM Qualification WHERE idProfissional=${id};`
      );
      for (const element of query) {
        console.log("Elemento: " + element);
        qualifications.push(new Qualification(element));
      }
      return qualifications;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = Qualification;
