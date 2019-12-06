var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View product sale by department",
                "Create new Department",
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View product sale by department":
                    viewProductSaleByDepartment();
                    break;
                case "Create new Department":
                    createNewDepartment();
                    break;
            }
        });
}
function viewProductSaleByDepartment() {
    // var profit = products.product_sales - departments.over_head_cost
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_cost,(SUM(products.product_sales) - departments.over_head_cost) AS total_profit, SUM(products.product_sales) AS product_sales FROM departments JOIN products ON (departments.department_name = products.department_name) GROUP BY departments.department_id ORDER BY departments.department_id asc"

        , function (err, res) {
            if (err) throw err;
            var t = new Table;
            res.forEach(function (departments) {
                t.cell('Department ID', departments.department_id)
                t.cell('Department Name', departments.department_name)
                t.cell('Overhead Cost', departments.over_head_cost)
                t.cell('Product Sales', departments.product_sales)
                t.cell('Total profit', departments.total_profit)
                t.newRow()
            });
            console.log(t.toString());
            console.log("-----------------------------------------------------------");
            start();
        });
};

function createNewDepartment() {
    console.log("new Department");
    inquirer.prompt([
        {
            name: "dep",
            type: "input",
            message: "What is the department's name?"
        },
        {
            name: "overhead_cost",
            type: "input",
            message: "What is the overhead cost of the department?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
    ])
        .then(function (answer) {
            // var overHead = "0";
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.dep,
                    over_head_cost: answer.overhead_cost,
                },
                function (err) {
                    if (err) throw err;
                    console.log("New Department created successfully!");
                    console.log("---------------------------------");
                   start();
                });
        });
};