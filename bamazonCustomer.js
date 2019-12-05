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

    action();
});

function action() {
    //DISPLAY: item_id + product_name + price
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            // console.log("---------------------------------") //only print line after item 10
        };
        //PROMPT USER with 2 messages to select: id + units
        inquirer.prompt([
            {
                name: "product",
                type: "input",
                message: "What is the id of the product you would like to buy?",
                validate: function (value) {    //how to solve this?
                    if (isNaN(value) || value > 11) {
                        console.log("\n Select an item_id from 1 to 10");
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                name: "orderQuantity",
                type: "input",
                message: "How many would you like to order?"
            }
        ])
            .then(function (answer) {
                var product = res[(answer.product - 1)];
                var orderQuantity = answer.orderQuantity;
                //if not enough units, print "Insufficient quantity!"
                if (orderQuantity > product.stock_quantity) {
                    console.log("---------------------------------")
                    console.log("Insufficient Quantity!")
                    console.log("---------------------------------")

                    inquirer.prompt([
                        {
                            message: "Would you like to place a new order?",
                            type: "list",
                            choices: ["New Order", "Exit \n"],
                            name: "action"
                        }
                    ])
                        .then(function (answer) {
                            switch (answer.action) {
                                case ("New Order"):
                                    // console.log("this is working");
                                    action();
                                    break;
                                case ("Exit \n"):
                                    connection.end();
                            }
                        });
                } else {
                    //if enough quantities are ordered: 
                    var newStock = parseInt((product.stock_quantity - orderQuantity));

                    // update database to reflect quantities 
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStock //
                            },
                            {
                                item_id: product.item_id
                            }
                        ], function (err, res) {
                            if (err) throw err;
                            console.log(orderQuantity + " " + product.product_name + " " + "ordered!\n" + "Total: $" + orderQuantity * product.price);

                        }
                    );
                    // console.log(query.sql);  // logs the actual query being run

                };
            });
    });
};
