var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "top_songsDB"
});
connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});
function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View product sale by department",
        "Create new Department",
       
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Find songs by artist":
        artistSearch();
        break;
      case "Find all artists who appear more than once":
        multiSearch();
        break;
      case "Find data within a specific range":
        rangeSearch();
        break;
      case "Search for a specific song":
        songSearch();
        break;
      case "Find artists with a top song and top album in the same year":
        songAndAlbumSearch();
        break;
      }
    });
}
function artistSearch() {