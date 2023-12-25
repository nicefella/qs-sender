const sql = require('mssql/msnodesqlv8');
const dbConfig = require('./config');
// const msnodesqlv8 = require('msnodesqlv8');

const sqlConnect = async () => {
     const sqlDb = await new sql.ConnectionPool(dbConfig).connect();
     return sqlDb;
};

// async function poolPromise () {
//   new sql.ConnectionPool(dbConfig).connect();

//   .then(pool => {
//     console.log('Connected to MSSQL');
//     return pool;
//   })
//   .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

module.exports = { sqlConnect };
