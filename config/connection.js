const mysql = require('mysql2');
const chalk = require('chalk');

/**
 * Deals the connection of the database
 * @class
 */
class Db {

  /**
   * Connection to database
   * @type {mysql.Pool}
   * @public
   * @static
   */
  static pool;
  /**
   * Hostname of the database you trying to connect
   * @type {String}
   * @private
   */
  #host;
  /**
   * Username of the database you trying to connect
   * @type {String}
   * @private
   */
  #user;
  /**
   * Password of the database you trying to connect
   * @type {String}
   * @private
   */
  #password;
  /**
   * Name of schema of the database you trying to connect
   * @type {String}
   * @private
   */
  #schema;

  /**
   * Creates a new Db object
   * @constructor
   * @param {Object} obj - The object with which to create the Db object
   * @param {String} obj.host - The hostname of the database
   * @param {String} obj.user - The username to connect to the database
   * @param {String} obj.password - The password to connect to the database
   * @param {String} obj.schema - The name of the schema in the database
   */
  constructor(obj) {
    if (!obj)
      return
    this.#host = obj.host
    this.#user = obj.user
    this.#password = obj.password
    this.#schema = obj.schema
  }

  /**
   * Connects to the database
   * @returns {Promise<mysql.Pool>} - A promise resolving to a mysql connection pool
   */
  connect() {
    return new Promise((resolve, reject) => {
      let pool = mysql.createPool({
        connectionLimit: 20,
        host: this.#host,
        user: this.#user,
        password: this.#password,
        database: this.#schema
      });

      pool.getConnection((err, connection) => {

        if (err) {
          if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            reject('Database connection was closed.')
          }

          if (err.code === 'ER_CON_COUNT_ERROR') {
            reject('Database has too many connections.')
          }

          if (err.code === 'ECONNREFUSED') {
            reject('Database connection was refused.')
          }
          console.log(err);
        }

        if (connection) {
          connection.release()
          console.log(chalk.green("  Connection to the database"))
          Db.pool = pool.promise();
          resolve(pool.promise())
        }
      })
    })
  }
}

module.exports = Db;