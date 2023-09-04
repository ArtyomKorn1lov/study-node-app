const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  port: "13306",
  user: 'root',
  password: 'dev',
  database: 'node_test'
});

connection.connect();

connection.query('SELECT * FROM `messages`', (err, rows, fields) => {
  if (err) throw err;

  console.log('Данные из СУБД: ', rows);
});

const cors = require('cors');
const express = require('express');
const app = express();
const port = 3001;
app.use(cors());

app.get('/api/messages/all', (req, res) => {
  connection.query('SELECT * FROM `messages`', (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});