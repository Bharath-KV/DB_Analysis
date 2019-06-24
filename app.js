`use strict`;

// Postgresql Credentials
let db = require('./config');

let dbSize;
let tableSizesArray;
let dbRes = [];

let query = ``;

let analyze = async () => {

    query = `SELECT pg_database_size('dkinsights_db')`;

    // Execute Query
    dbSize = await db.query(query);

    query = `SELECT 
        table_schema,
        table_name,
        pg_size_pretty(pg_total_relation_size('"'||table_schema||'"."'||table_name||'"')) AS table_size
        FROM 
        information_schema.tables 
        WHERE 
        table_schema = 'source'
        OR
        table_schema = 'target'`;

    // Execute query
    tableSizesArray = await db.query(query);

    dbRes = {
        dbSize: dbSize.rows[0].pg_database_size, 
        tableSizesArray: JSON.stringify(tableSizesArray.rows)
    };

    console.log(JSON.parse(dbRes.tableSizesArray));

}

analyze();
