const mysql = require('mysql');
const bodyParser = require('body-parser');
const connection = mysql.createConnection({
  host: 'localhost',
  port: "13306",
  user: 'root',
  password: 'dev',
  database: 'telegram_test'
});
connection.connect();
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Контроллеры пользователей */
app.get('/api/telegram/getUsers/:userId', async (req, res) => {
  let data = [req.params.userId];
  await connection.query('SELECT * FROM `User` WHERE Id != ?', data, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    res.send(rows);
  });
})

/* Контроллеры сообщений */
app.get('/api/telegram/all/:userId/:senderId/', (req, res) => {
  let data = [req.params.userId, req.params.senderId, req.params.userId, req.params.senderId];
  connection.query('SELECT * FROM Message WHERE (AuthorId = ? AND SenderId = ?) OR (SenderId = ? AND AuthorId = ?) ORDER BY CREATED ASC, Id ASC', data, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    res.send(rows);
  })
});

app.post('/api/messages/add', (req, res) => {
  const curData = new Date();
  let data = [req.body.text, curData, curData, req.body.userId, req.body.senderId];
  connection.query('INSERT INTO Message (Text, CREATED, EDITED, AuthorId, SenderId) VALUES (?, ?, ?, ?, ?)', data, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    res.send("success");
  });
});

app.put('/api/messages/update', (req, res) => {
  const curData = new Date();
  let data = [req.body.text, curData, req.body.id];
  connection.query('UPDATE Message SET Text=?, EDITED=? WHERE Id=?', data, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    res.send("success");
  });
})

app.delete('/api/messages/delete/:id/', (req, res) => {
  let data = [req.params.id];
  connection.query('DELETE FROM Message WHERE Id=?', data, (err, rows, fields) => {
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
