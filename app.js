const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  port: "3306",
  user: 'root',
  password: '',
  database: 'node_test'
});
connection.connect();
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3001;
app.use(cors());

app.get('/api/messages/all', (req, res) => {
  connection.query('SELECT * FROM Message LEFT JOIN Users ON Message.UserId = Users.Id', (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
});

app.get('/api/messages/users', (req, res) => {
  connection.query('SELECT * FROM Users', (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});