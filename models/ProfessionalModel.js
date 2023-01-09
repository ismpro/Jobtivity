let DB = require('../config/connection');

/**
 * A class representing a professional.
 * @class
 */
class Professional {
  /**
   * Creates a new Professional instance.
   * @param {Object} obj - The properties of the Professional.
   * @param {Number} obj.id - The ID of the professional.
   * @param {String} obj.birthday - The birthday of the professional in the format 'YYYY-MM-DD'.
   * @param {String} obj.gender - The gender of the professional.
   * @param {String} obj.local - The local of the professional.
   * @param {Boolean} obj.private - Whether the professional is private or not.
   */
  constructor(obj) {
    if (!obj) return;
    this.id = obj.id
    this.birthday = obj.birthday
    this.gender = obj.gender
    this.local = obj.local
    this.private = obj.private
  }

  /**
   * Creates a new professional in the database.
   * @returns {Promise<Number>} - The ID of the newly created professional.
   */
  async create() {
    try {
      let professional = await DB.pool.query(`
      INSERT INTO Profissional (birthday, gender, local, private)
      VALUES (STR_TO_DATE('${this.birthday}', "%Y-%m-%d"), '${this.gender}', '${this.local}', ${this.private === true ? 1 : 0});`);
      this.id = professional[0].insertId;
      return professional[0].insertId;
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = Professional;