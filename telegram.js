const mysql = require('mysql');
const bodyParser = require('body-parser');
const connection = mysql.createConnection({
  host: 'localhost',
  port: "3306",
  user: 'root',
  password: '',
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
