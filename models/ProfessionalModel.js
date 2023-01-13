let DB = require('../config/connection');

/**
 * Class representing a Professional.
 * @class
 */
class Professional {

  /**
   * Creates a new Professional instance.
   * @constructor
   * @param {Object} obj - The object containing the properties of a professional.
   * @param {Number} obj.id - The id of the professional.
   * @param {Date} obj.birthday - The birthday of the professional.
   * @param {String} obj.gender - The gender of the professional.
   * @param {String} obj.local - The local of the professional.
   * @param {Boolean} obj.private - Indicates if the professional's information is private.
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
   * @returns {Promise<Number>} - The id of the created professional. 
   */
  async create() {
    try {
      let professional = await DB.pool.query(`
      INSERT INTO Professional (birthday, gender, local, private)
      VALUES (STR_TO_DATE(?, "%Y-%m-%d"), '?', '?', ?);`,
        [this.birthday.toISOString().split("T")[0], this.gender, this.local, this.private === true ? 1 : 0]);
      this.id = professional[0].insertId;
      return professional[0].insertId;
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Updates a professional's information in the database.
   * @returns {Promise<void>}
   */
  async update() {
    await DB.pool.query(`
    UPDATE Professional SET
    birthday = STR_TO_DATE(?, "%Y-%m-%d"),
    gender = ?,
    local = ?,
    private = ?
    WHERE idProfessional= ?;`,
      [this.birthday.toISOString().split("T")[0], this.gender, this.local, this.private === true ? 1 : 0, this.id]);
    return;
  }

  /**
   * Retrieves a professional from the database by their id.
   * @static 
   * @param {Number} id - The id of the professional.
   * @returns {Promise<Professional|null>} - The professional with the given id or null if no such professional exists.
   */
  static async getById(id) {
    if (id && !isNaN(id) && Number.isSafeInteger(id)) {
      try {
        const [query] = await DB.pool.query(`select idProfessional"id", birthday, gender, local, private from Professional
                                                  where idProfessional=?`, [id]);
        if (query.length === 0) return null;
        return new Professional({ ...query[0], private: query[0].private === 1, birthday: new Date(query[0].birthday) });
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
   * Retrieves all professionals from the database.
   * @static
   * @returns {Promise<Professional[]|null>} - An array of all professionals in the database. 
   */
  static async getAllProfessionals() {
    let professionals = [];
    try {
      const [query] = await DB.pool.query(`select idProfessional"id", birthday, gender, local, private from Professional`);
      if (query.length === 0) return null;
      for (const element of query) {
        professionals.push(new Professional({ ...element, private: element.private === 1, birthday: new Date(element.birthday) }));
      }
      return professionals;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * Retrieves a professional from the database by their id.
   * @static
   * @param {Number} id - The id of the professional.
   * @returns {Promise<Professional|null>} - The professional with the given id or null if no such professional exists.
   */
  static async getProfessionalById(id) {
    if (id && !isNaN(id) && Number.isSafeInteger(id)) {
      try {
        const [query] = await DB.pool.query(`select idProfessional"id", birthday, gender, local, private from Professional where idProfessional=?`, [id]);
        if (query.length === 0) return null;
        return new Professional({ ...query[0], private: query[0].private === 1, birthday: new Date(query[0].birthday) });
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

module.exports = Professional;
