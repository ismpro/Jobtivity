let DB = require("../config/connection");

/**
 * Class representing a Qualification.
 * @class
 */
class Qualification {

  /**
   * Creates an instance of Qualification.
   * @param {Object} obj - The object containing the properties of the qualification.
   * @param {Number} obj.id - The id of the qualification.
   * @param {String} obj.name - The name of the qualification.
   * @param {String} obj.local - The local where the qualification was obtained.
   * @param {String} obj.type - The type of the qualification.
   * @param {String} obj.grade - The grade of the qualification.
   * @param {Number} obj.professional - The object containing the properties of the qualification.
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
   * Creates a new Qualification in the database.
   * @returns {Number} The id of the newly created Qualification.
   */
  async create() {
    let qualification = await DB.pool.query(`
      INSERT INTO Qualification (name, local, type, grade, idProfissional)
      VALUES (?, ?, ?, ?, ?);`,
      [this.name, this.local, this.type, this.grade, this.professional]);
    this.id = qualification[0].insertId;
    return qualification[0].insertId;
  }

  /**
   * Retrieves a Qualification by its id.
   * @static
   * @param {Number} id - The id of the Qualification to retrieve.
   * @returns {Promise<Qualification[]|null>} An array containing the Qualification objects.
   * @throws {String} - If the id is invalid.
   */
  static async getQualificationById(id) {
    if (id && !isNaN(id) && Number.isSafeInteger(id)) {
      let qualifications = [];
      try {
        const [query] = await DB.pool.query(
          `SELECT idQualification"id", local, name, type, grade, idProfissional"professional" FROM Qualification WHERE idProfissional=?;`,
          [id]);
        for (const element of query) {
          console.log("Elemento: " + element);
          qualifications.push(new Qualification(element));
        }
        return qualifications;
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

module.exports = Qualification;
