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
            pg_total_relation_size('"'||table_schema||'"."'||table_name||'"')::text::int AS tablesize,
            (xpath('/row/cnt/text()', query_to_xml(format('select count(*) as cnt from %I.%I', 
                                        table_schema, 
                                        table_name), 
                                        false, 
                                        true, '')))[1]::text::int as rowcount
            FROM 
            information_schema.tables
            WHERE 
            table_schema = 'source'
            OR
            table_schema = 'target'`;

    // Execute query
    tableSizesArray = await db.query(query);

    tableSizesArray.rows.map(t => {
        t.rowSize = String((t.tablesize/t.rowcount)/1024) + ' KB';
    });

    // let tables = JSON.stringify(tableSizesArray.rows);

    dbRes = {
        dbSize: dbSize.rows[0].pg_database_size, 
        tableSizesArray: tableSizesArray.rows
    };

    console.log(dbRes);

}

analyze();
