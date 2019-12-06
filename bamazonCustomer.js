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
    console.log("connected as id " + connection.threadId + "\n");

    action();
});

function action() {
    //DISPLAY: item_id + product_name + price
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var t = new Table;
        res.forEach(function (product) {
            t.cell('Item ID', product.item_id)
            t.cell('Product Name', product.product_name)
            t.cell('Department', product.department_name)
            t.cell('Price USD', product.price)
            t.cell('Quantity', product.stock_quantity)
            t.newRow()
        });
        console.log(t.toString());

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
            var product = res[answer.product - 1];
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
                // update database to reflect quantities 
                var newStock = parseInt((product.stock_quantity - orderQuantity));
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newStock //
                        },
                        {
                            item_id: product.item_id
                        },
                    ], function (err, res) {
                        if (err) throw err;
                        console.log(orderQuantity + " " + product.product_name + " " + "ordered!\n" + "Total: $" + orderQuantity * product.price);
                    }
                );
                //         var prodSales = product.product_sales;
                // prodSales += (num * product.price);

                var priceXquantity = product.product_sales;
                priceXquantity += orderQuantity * product.price;
                // parseInt((orderQuantity * product.price));

                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            product_sales: priceXquantity
                        },
                        {
                            item_id: product.item_id
                        }
                    ], function (err) {
                        if (err) throw err;
                    })
                // console.log(query.sql);  // logs the actual query being run

            };
        });
});
};
