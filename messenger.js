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
  connection.query('SELECT Message.Id, Text, Date, UserId, Name FROM Message LEFT JOIN Users ON Message.UserId = Users.Id ORDER BY Date ASC, Message.Id ASC', (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    res.send(rows);
  })
});

app.get('/api/users/all', (req, res) => {
  connection.query('SELECT * FROM Users', (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    res.send(rows);
  })
});

app.post('/api/messages/add', (req, res) => {
  if (req.body.text === undefined || req.body.text.trim("") === "") {
    const error = "Пустое сообщение";
    res.send(error);
    throw error;
  }
  if (req.body.date === undefined) {
    const error = "Пустая дата";
    res.send(error);
    throw error;
  }
  if (req.body.userId === undefined || req.body.userId <= 0) {
    const error = "Некорректный ID пользователя";
    res.send(error);
    throw error;
  }
  let data = [req.body.text, new Date(req.body.date), req.body.userId];
  connection.query('INSERT INTO Message (Text, Date, UserId) VALUES (?, ?, ?)', data, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    res.send("success");
  });
});

app.post('/api/messages/delete', (req, res) => {
  if (req.body.id === undefined || req.body.id <= 0) {
    const error = "Некорректный ID записи";
    res.send(error);
    throw error;
  }
  let data = [req.body.id];
  connection.query('DELETE FROM Message WHERE Id=?', data, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    res.send("success");
  });
});

app.post('/api/messages/update', (req, res) => {
  if (req.body.id === undefined || req.body.id <= 0) {
    const error = "Некорректный ID записи";
    res.send(error);
    throw error;
  }
  if (req.body.text === undefined || req.body.text.trim("") === "") {
    const error = "Пустое сообщение";
    res.send(error);
    throw error;
  }
  let data = [req.body.text, req.body.id];
  connection.query('UPDATE Message SET Text=? WHERE Id=?', data, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    res.send("success");
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});