let DB = require('../app/connection');

/**
 * Class for handling past job information for a professional.
 *
 * @class
 */
class PastJob {
  
  /**
   * Initializes properties of a past job object.
   *
   * @constructor
   * @param {Object} obj - The past job object.
   * @param {Number} obj.id - The ID of the past job.
   * @param {String} obj.name - The name of the past job.
   * @param {String} obj.url - The url of the past job.
   * @param {Date} obj.beginDate - The begin date of the past job.
   * @param {Date} obj.endDate - The end date of the past job.
   * @param {String} obj.description - The description of the past job.
   * @param {Number} obj.professional - The ID of the professional.
   */
  constructor(obj) {
    if (!obj) return;
    this.id = obj.id
    this.name = obj.name
    this.url = obj.url
    this.beginDate = obj.beginDate
    this.endDate = obj.endDate
    this.description = obj.description
    this.professional = obj.professional
  }

  /**
    * Creates a new past job in the database.
    *
    * @return {Promise<Number>} - The ID of the newly created past job.
    */

  async create() {
    try {
      let pastjob = await DB.pool.query(
    "INSERT INTO PastJob (name, url, beginDate, endDate, description, idProfissional) VALUES (?, ?, STR_TO_DATE(?, '%Y-%m-%d'), STR_TO_DATE(?, '%Y-%m-%d'), ?, ?)",
    [this.name, this.url, this.beginDate.toISOString().split("T")[0], this.endDate.toISOString().split("T")[0], this.description, this.professional]);
      this.id = pastjob[0].insertId;
      return pastjob[0].insertId;
    } catch (error) {
      console.log(error)
    }
  }

  async update() {
    await DB.pool.query(`
    UPDATE PastJob SET
    name = ?,
    url = ?,
    beginDate = ?,
    endDate = ?,
    description = ?
    WHERE idPastJob = ?;`,
        [this.name, this.url, this.beginDate.toISOString().split("T")[0], this.endDate.toISOString().split("T")[0], this.description, this.id]);
    return;
}

async delete(){
  await DB.pool.query(`
    DELETE FROM PastJob
    WHERE idPastJob = ?;
  `,
  [this.id]);
  return;
}

  /**
   * Retrieves past job by its professional ID from the database.
   *
   * @static
   * @param {Number} id - The ID of the professional.
   * @return {Promise<Array<PastJob>>} - An array of the past jobs of the professional.
   */
  static async getPastJobByProfessionalId(id) {
    let pastjob = [];
    try {
      const [query] = await DB.pool.query(
        `SELECT idPastJob"id", name, url, beginDate, endDate, description, idProfissional"professional" FROM PastJob WHERE idProfissional=?;`,
      [id]);
      for (const element of query) {
        pastjob.push(new PastJob({...element, beginDate: new Date(element.beginDate), endDate: new Date(element.endDate)}));
      }
      return pastjob;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async getPastJobById(id) {
    if (id && !isNaN(id) && Number.isSafeInteger(id)) {
      try {
        const [query] = await DB.pool.query(
          `SELECT idPastJob"id", name, url, beginDate, endDate, description, idProfissional"professional" FROM PastJob WHERE idPastJob=?;`,
          [id]);
          if (query.length === 0) return null;
          return new PastJob(query[0]);
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

module.exports = PastJob;
