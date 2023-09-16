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

const rand = () => {
  return Math.random().toString(36).substr(2); // remove `0.`
};

const token = () => {
  return rand() + rand(); // to make it longer
};

//Генерация токена
const generateTokenData = (login, name) => {
  const tokenData = new Date();
  return {
    login: login,
    name: name,
    accessToken: token(),
    refreshToken: token(),
    tokenExpire: new Date(tokenData.getTime() + 3 * 60000)
  };
};

/* Контроллеры пользователей */
//Получение списка пользователей для переписки
app.get('/api/telegram/getUsers/:userId', (req, res) => {
  let data = [req.params.userId];
  connection.query('SELECT * FROM `User` WHERE Id != ?', data, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    res.send(rows);
  });
});

//Регистрация пользователя в системе
app.post('/api/telegram/register', (req, res) => {
  if (req.body.password !== req.body.repeat_password) {
    res.status(400).json({ error: "Пароли не совпадают" });
    return;
  };
  const login = [req.body.login];
  connection.query('SELECT * FROM `User` WHERE Login = ?', login, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    if (rows[rows.length - 1].Login === req.body.login) {
      res.status(400).json({ error: "Пользователь уже зарегистрирован с данным логином" });
      return;
    };
    const response = generateTokenData(req.body.login, req.body.name);
    const data = [req.body.login, req.body.name, req.body.password, response.accessToken, response.refreshToken, response.tokenExpire, new Date(tokenData.getTime() + 10080 * 60000)];
    connection.query('INSERT INTO `User` (`Login`, `Name`, `Password`, `AccessToken`, `RefreshToken`, `TokenExpire`, `RefreshExpire`) VALUES (?, ?, ?, ?, ?, ?, ?)', data, (err, rows, fields) => {
      if (err) {
        res.send(err);
        throw err;
      };
      res.send(response);
    });
  });
});

//Авторизация
app.post('api/telegram/autorize', (req, res) => {
  const authorize = [req.body.login, req.body.password];
  connection.query('SELECT * FROM `User` WHERE Login = ? AND Password = ?', authorize, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    if (rows.length <= 0) {
      res.status(400).json({ error: "Неверные логин или пароль" });
      return;
    };
    const response = generateTokenData(req.body.login, rows[rows.length - 1].Name);
    const data = [response.accessToken, response.refreshToken, response.tokenExpire, new Date(tokenData.getTime() + 10080 * 60000), req.body.login];
    connection.query('UPDATE User SET AccessToken=?, RefreshToken=?, TokenExpire=?, RefreshExpire=? WHERE Login=?', data, (err, rows, fields) => {
      if (err) {
        res.send(err);
        throw err;
      };
      res.send(response);
    });
  });
});

//Обновление токена
app.post('api/telegram/refresh', (req, res) => {
  const login = [req.body.login];
  connection.query('SELECT * FROM `User` WHERE Login = ?', login, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    if (req.body.accessToken !== rows[rows.length - 1].AccessToken) {
      res.status(400).json({ error: "Ошибка доступа" });
      return;
    };
    if (req.body.refreshToken !== rows[rows.length - 1].RefreshToken) {
      res.status(400).json({ error: "Ошибка доступа" });
      return;
    };
    if (rows[rows.length - 1].RefreshExpire < new Date()) {
      res.status(400).json({ error: "Срок действия авторизации истёк" });
      return;
    };
    const response = {
      accessToken: token(),
      tokenExpire: new Date(tokenData.getTime() + 3 * 60000)
    };
    const data = [expireData.accessToken, expireData.tokenExpire, req.body.login];
    connection.query('UPDATE User SET AccessToken=?, TokenExpire=? WHERE Login=?', data, (err, rows, fields) => {
      if (err) {
        res.send(err);
        throw err;
      };
      res.send(response);
    });
  });
});

app.put('api/telegram/user-update', (req, res) => {
  const login = [req.header('login')];
  connection.query('SELECT * FROM `User` WHERE Login = ?', login, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    if (rows[rows.length - 1].AccessToken !== req.header('token')) {
      res.status(400).json({ error: "Нет доступа" });
      return;
    }
    if (req.body.password !== req.body.repeat_password) {
      res.status(400).json({ error: "Пароли не совпадают" });
      return;
    };
    const data = [req.body.login, req.body.name, req.body.password, req.body.login];
    connection.query('UPDATE User SET Login=?, Name=?, Password=?, RefreshExpire=? WHERE Login=?', data, (err, rows, fields) => {
      if (err) {
        res.send(err);
        throw err;
      };
      res.send("success");
    });
  });
});

/* Контроллеры сообщений */
//Получить список сообщений в диалоге с пользователем
app.get('/api/telegram/all/:userId/:senderId/', (req, res) => {
  const login = [req.header('login')];
  connection.query('SELECT * FROM `User` WHERE Login = ?', login, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    if (rows[rows.length - 1].AccessToken !== req.header('token')) {
      res.status(400).json({ error: "Нет доступа" });
      return;
    }
    let data = [req.params.userId, req.params.senderId, req.params.userId, req.params.senderId];
    connection.query('SELECT * FROM Message WHERE (AuthorId = ? AND SenderId = ?) OR (SenderId = ? AND AuthorId = ?) ORDER BY CREATED ASC, Id ASC', data, (err, rows, fields) => {
      if (err) {
        res.send(err);
        throw err;
      };
      res.send(rows);
    });
  });
});

//Отправить сообщение
app.post('/api/messages/add', (req, res) => {
  const login = [req.header('login')];
  connection.query('SELECT * FROM `User` WHERE Login = ?', login, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    if (rows[rows.length - 1].AccessToken !== req.header('token')) {
      res.status(400).json({ error: "Нет доступа" });
      return;
    }
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
});

//Редактировать сообщение
app.put('/api/messages/update', (req, res) => {
  const login = [req.header('login')];
  connection.query('SELECT * FROM `User` WHERE Login = ?', login, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    if (rows[rows.length - 1].AccessToken !== req.header('token')) {
      res.status(400).json({ error: "Нет доступа" });
      return;
    }
    const curData = new Date();
    let data = [req.body.text, curData, req.body.id];
    connection.query('UPDATE Message SET Text=?, EDITED=? WHERE Id=?', data, (err, rows, fields) => {
      if (err) {
        res.send(err);
        throw err;
      };
      res.send("success");
    });
  });
})

//Удалить сообщение
app.delete('/api/messages/delete/:id/', (req, res) => {
  const login = [req.header('login')];
  connection.query('SELECT * FROM `User` WHERE Login = ?', login, (err, rows, fields) => {
    if (err) {
      res.send(err);
      throw err;
    };
    if (rows[rows.length - 1].AccessToken !== req.header('token')) {
      res.status(400).json({ error: "Нет доступа" });
      return;
    }
    let data = [req.params.id];
    connection.query('DELETE FROM Message WHERE Id=?', data, (err, rows, fields) => {
      if (err) {
        res.send(err);
        throw err;
      };
      res.send("success");
    });
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
