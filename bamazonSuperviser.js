var mysql = require("mysql");
var inquirer = require("inquirer");
// var Table = require('easy-table'); 

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function (err) { // connect to the mysql server and sql database

    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    // action();
});