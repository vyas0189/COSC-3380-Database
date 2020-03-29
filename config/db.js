const { Pool } = require('pg');

const {
  PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE, NODE_ENV = 'development',
} = process.env;

const isProduction = NODE_ENV === 'production';
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`;

const db = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
});

module.exports = db;
