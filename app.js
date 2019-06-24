`use strict`;

// Common NPM Modules
let modules = require('./module');

// Postgresql Credentials
let db = require('./config');

let tableSizesArray;

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
                                        true, '')))[1]::text::int as totalrows
            FROM 
            information_schema.tables
            WHERE 
            table_schema = 'source'
            OR
            table_schema = 'target'
            ORDER BY table_schema`;

    // Execute query
    tableSizesArray = await db.query(query);

    tableSizesArray.rows.map(t => {
        t.SizePerRow = (t.tablesize/t.totalrows)/1024 > 1 ? 
                    String((t.tablesize/t.totalrows)/1024) + ' KB' : 
                    String((t.tablesize/t.totalrows)/(1024 * 2)) + ' MB';
    });

    let xls = modules.json2xls(tableSizesArray.rows);

    modules.fs.writeFileSync('dbAnalysis.xlsx', xls, 'binary');

}

analyze();
