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
      INSERT INTO Professional (birthday, gender, local, private)
      VALUES (STR_TO_DATE('?', "%Y-%m-%d"), '?', '?', ?);`,
      [this.birthday, this.gender, this.local, this.private === true ? 1 : 0]);
      this.id = professional[0].insertId;
      return professional[0].insertId;
    } catch (error) {
      console.log(error)
    }
  }

  static async getAllProfessionals(){
    let professionals = [];
    try{
      const [query] = await DB.pool.query(`select idProfessional"id", birthday, gender, local, private from Professional`);
      for(const element of query){
        professionals.push(new Professional({...element, private: element.private === 1}));
      }
      return professionals;
    } catch(err){
      console.log(err);
      throw err;
    }
  }

  static async getProfessionalById(id){
    if(id && !isNaN(id) && Number.isSafeInteger(id)){
      try{
        const [query] = await DB.pool.query(`select idProfessional"id", birthday, gender, local, private from Professional where idProfessional=?`, [id]);
        if(query.length === 0) return null;
        return new Professional({...query[0], private: query[0].private === 1});
      } catch(err){
        console.log(err);
        throw err;
      }
    }else{
      console.log("Invalid id");
      throw "Invalid id"
    }
}
}

module.exports = Professional;
