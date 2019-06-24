`use strict`;

// Common NPM Modules
let modules = require('./module');

let dbConnection = {
    host: 'HOST',
    port: 'PORT_NUMBER',
    user: 'DB_USER',
    password: 'DB_PASSWORD',
    database: 'DATABASE_NAME'
}

module.exports = new modules.pg.Pool(dbConnection);
