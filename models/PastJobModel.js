let DB = require('../config/connection');

/**
 * A class representing a PastJob.
 * @class
 */
class PastJob {
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
    this.id = obj.id
    this.name = obj.name
    this.url = obj.url
    this.beginDate = obj.beginDate
    this.endDate = obj.endDate
    this.description = obj.description
    this.professional = obj.idProfessional
  }

  /**
   * Creates a new PastJob in the database.
   * @returns {Promise<Number>} - The ID of the newly created professional.
   */
  async create() {
    try {
      let pastjob = await DB.pool.query(`
      INSERT INTO PastJob (name, url, beginDate, endDate, description, idProfissional)
      VALUES (STR_TO_DATE('${this.beginDate}', "%Y-%m-%d"), '${this.endDate}', "%Y-%m-%d"), '${this.name}', '${this.url}', '${this.description}', '${this.professional}');`);
      this.id = pastjob[0].insertId;
      return pastjob[0].insertId;
    } catch (error) {
      console.log(error)
    }
  }

  static async getPastJobById(id) {
    let pastjob = [];
    try {
      const [query] = await DB.pool.query(
        `SELECT idPastJob"id", name, url, beginDate, endDate, description, idProfissional"professional" FROM PastJob WHERE idProfissional=${id};`
      );
      for (const element of query) {
        console.log("Elemento: " + element);
        pastjob.push(new PastJob(element));
      }
      return pastjob;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

}

module.exports = PastJob;
