const mysql = require('mysql');
const bodyParser = require('body-parser');
const connection = mysql.createConnection({
  host: 'localhost',
  port: "13306",
  user: 'root',
  password: 'dev',
  database: 'node_test'
});
connection.connect();
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/messages/all', (req, res) => {
  connection.query('SELECT * FROM Message LEFT JOIN Users ON Message.UserId = Users.Id', (err, rows, fields) => {
    console.log(rows);
    if (err) throw err;
    res.send(rows);
  })
});

app.get('/api/users/all', (req, res) => {
  connection.query('SELECT * FROM Users', (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
});

app.post('/api/messages/add', (req, res) => {
  let data = [];
  data = [req.body.text, req.body.date, req.body.userId];
  connection.query('INSERT INTO Message (Text, Date, UserId) VALUES (?, ?, ?)', data, (err, rows, fields) => {
    if (err) throw err;
    res.send("success");
  });
});

app.post('/api/messages/delete', (req, res) => {
  let data = [];
  data = [req.body.id];
  connection.query('DELETE FROM Message WHERE Id=?', data, (err, rows, fields) => {
    if (err) throw err;
    res.send("success");
  });
});

app.post('/api/messages/update', (req, res) => {
  let data = [];
  data = [req.body.text, req.body.date, req.body.id];
  connection.query('UPDATE Message SET Text=?, Date=? WHERE Id=?', data, (err, rows, fields) => {
    if (err) throw err;
    res.send("success");
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});