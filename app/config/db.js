const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: 'website',
    user: 'website',
    password: 'mysqlpw1',
    database: 'pw',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {

    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }

        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }

        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
        console.log(err);
    }

    if (connection) connection.release()
    return
})

module.exports = pool.promise();