const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://default:vVRGB2TaujN6@ep-curly-snow-a4a878si-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
    user: process.env.DB_USER ,
    password:process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    PORT: process.env.PORT,
    database:process.env.DB,
    ssl:true
})
module.exports = pool;
