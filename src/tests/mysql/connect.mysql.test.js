const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Vhmtdkbdhpdm0",
  database: "shopDEV",
});

const batchSize = 100000;
const totalSize = 10000000;

let currentId = 1;

console.time(`=======TIME========`);
const insertBatch = async () => {
  const values = [];

  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd(`=======TIME========`);
    pool.end((err) => {
      if (err) {
        console.log(`error occurred while running patch`);
      } else {
        console.log(`connect pool closed successfully`);
      }
    });
    return;
  }

  const sql = `INSERT INTO test_table(id, name, age, address) VALUES ?`;

  pool.query(sql, [values], async function (err, results) {
    if (err) throw err;

    console.log(`inserted ${results.affectedRows} records`);

    await insertBatch();
  });
};

insertBatch().catch(console.error);
