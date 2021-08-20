const Sequelize = require("sequelize");
const express = require("express");
// const bodyParser = require("body-parser");
const mysql = require('mysql2/promise');
 
const app = express();
const urlencodedParser = express.urlencoded({extended: true});
const dbName = "usersdb";

mysql.createConnection({
  host: "localhost",
  // port: "3306",
  user     : "root",
  password : "123456",
}).then( connection => {
  connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`).then((res) => {
      console.info("Database create or successfully checked");
  })
})

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "usersdb",
//   password: "123456"
// });

// connection.connect(function(err){
//   if (err) {
//     return console.error("Ошибка: " + err.message);
//   }
//   else{
//     console.log("Подключение к серверу MySQL успешно установлено");
//   }
// });

// определяем объект Sequelize
const sequelize = new Sequelize("usersdb", "root", "123456", {
  dialect: "mysql",
  host: "localhost",
  port: "3306",
  define: {
    timestamps: false
  }
});

// определяем модель User
const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  dob: {
    type: Sequelize.DATEONLY,
    allowNull: false
  }
});
 
app.set("view engine", "hbs");
 
// синхронизация с бд, после успешной синхронизации запускаем сервер
sequelize.sync().then(()=>{
  app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
  });
}).catch(err=>console.log(err));
 
// получение данных
app.get("/", function(req, res){
    User.findAll({raw: true }).then(data=>{
      res.render("index.hbs", {
        users: data
      });
    }).catch(err=>console.log(err));
});
 
app.get("/create", function(req, res){
    res.render("create.hbs");
});
 
// добавление данных
app.post("/create", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
         
    const username = req.body.name;
    const useremail = req.body.email;
    const userdob = req.body.dob;
    User.create({ name: username, email: useremail, dob: userdob}).then(()=>{
      res.redirect("/");
    }).catch(err=>console.log(err));
});
 
// получаем объект по id для редактирования
app.get("/edit/:id", function(req, res){
  const userid = req.params.id;
  User.findAll({where:{id: userid}, raw: true })
  .then(data=>{
    res.render("edit.hbs", {
      user: data[0]
    });
  })
  .catch(err=>console.log(err));
});
 
// обновление данных в БД
app.post("/edit", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
 
  const username = req.body.name;
  const useremail = req.body.email;
  const userdob = req.body.dob;
  const userid = req.body.id;
  User.update({name:username, email: useremail, dob: userdob}, {where: {id: userid} }).then(() => {
    res.redirect("/");
  })
  .catch(err=>console.log(err));
});
 
// удаление данных
app.post("/delete/:id", function(req, res){  
  const userid = req.params.id;
  User.destroy({where: {id: userid} }).then(() => {
    res.redirect("/");
  }).catch(err=>console.log(err));
});