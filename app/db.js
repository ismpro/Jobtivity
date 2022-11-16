const mysql = require('mysql2');
const fs = require("fs");

class Db {
    static pool;
    #host;
    #user;
    #password;
    #database;

    constructor(obj) {
        if (!obj)
            return
        this.#host = obj.host
        this.#user = obj.user
        this.#password = obj.password
        this.#database = obj.database
    }

    connect() {
        return new Promise((resolve, reject) => { 
            let pool = mysql.createPool({
                connectionLimit: 20,
                host: this.#host,
                user: this.#user,
                password: this.#password,
                database: this.#database
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
              
                if (connection)  {
                    connection.release()
                    Db.pool = pool.promise();
                    resolve(pool.promise())
                }
                return
              })
            
        })
    }
}

module.exports = Db;