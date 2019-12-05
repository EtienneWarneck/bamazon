var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});
connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});
function runSearch() {
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
    connection.query(`SELECT
    departments.*, products.department_name 
    FROM departments
    JOIN products ON departments.department_name = products.department_name`

        , function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log("Dep ID: " + res[i].department_id + "Dep NAME: " + res[i].department_name + "Dep OHC: " + res[i].over_head_cost );
            };
            // var query =`SELECT 
            // departments.department_id, departments.department_name, departments.over_head_cost,
            // FROM bamazon_db.departments` ;
            // connection.query(query,function (err, result) {
            //     if (err) throw err;
            //     for (var i = 0; i < result.length; i++) {
            //         console.log("department_id: " + result[i].departments.department_id 
            //         // + " || department_name: " + res[i].department_name
            //         //     + " || over_head_cost: " + res[i].over_head_cost + " || product_sales: " + res[i].product_sales
            //             );
            // }
        });
};

// products.products_sale,
// INNER JOIN bamazon_db.departments
// departments.department_id, departments.department_name, departments.over_head_cost,
// INNER JOIN bamazon.products
// ON departments.department_name = products.department_name