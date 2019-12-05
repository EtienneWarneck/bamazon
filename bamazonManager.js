var inquirer = require("inquirer");
var mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;

    inquirer.prompt([
        {
            type: 'list',
            name: 'toDo',
            message: 'What would you like to do?',
            choices: [
                'VIEW PRODUCTS FOR SALE', //if selected, list every item: id + name + price + quantity
                'VIEW THE INVENTORY',  // if selected ,all items with count < 5
                'ADD TO INVENTORY',   // if selected, a prompt to add more of any item in store
                'ADD A PRODUCT'     // if selected, add a completely new product
            ],
        },
    ])
        .then(function (inquirerResponse) {
            //
            if (inquirerResponse.toDo == 'VIEW PRODUCTS FOR SALE') {
                console.log("Selecting all products...\n");
                connection.query("SELECT * FROM products", function (err, response) {
                    if (err) throw err;
                    for (var i = 0; i < response.length; i++) {
                        console.log(response[i].item_id + " | " + response[i].product_name + " | " + response[i].price + " | " + response[i].stock_quantity);
                        // console.log(response);  // Log all results of the SELECT statement
                        // connection.end();
                    }
                });
            };

            //fun
          
            if (inquirerResponse.toDo == 'VIEW THE INVENTORY') {
                connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, response) {
                    if (err) throw err;
                    for (var i = 0; i < response.length; i++) {
                        console.log(response[i].item_id + " | " + response[i].product_name + " | " + response[i].price + " | " + response[i].stock_quantity);
                    };
                });
            };

            //
            if (inquirerResponse.toDo == 'ADD TO INVENTORY') {
                connection.query("SELECT * FROM products", function (err, response) {

                    inquirer.prompt([
                        {
                            name: "productId",
                            type: "input",
                            message: "What is the id of the product you would like to add?",
                        },
                        {
                            name: "addedQuantity",
                            type: "input",
                            message: "How many would you like to add?"
                        }
                    ])
                        .then(function (answer) {
                            console.log(answer);
                            console.log(response);
                            var product = response[answer.productId - 1]; //??
                        
                            var addedQuantity = answer.addedQuantity; 
                            var addToStock = parseInt(product.stock_quantity) + parseInt(addedQuantity); //only selected
                            connection.query("UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: addToStock //dbcolumn : name from prompt inquirer
                                    },
                                    {
                                        item_id: answer.productId
                                    }
                                ], function (err, response) {
                                    if (err) throw err;
                                    console.log(addedQuantity + " " + product.product_name + " " + "added to stock\n" + "Total items: " + addToStock);
                                    console.log(response.affectedRows + " product updated!\n");
                                }
                            );
                        });
                });
            };

            //
            if (inquirerResponse.toDo == 'ADD A PRODUCT') {
                console.log("new product");
                inquirer.prompt([
                    {
                        name: "item",
                        type: "input",
                        message: "What is the item name?"
                    },
                    {
                        name: "department",
                        type: "input",
                        message: "What is the department name?"
                    },
                    {
                        name: "price",
                        type: "input",
                        message: "What is the price per item?",
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: "quantities",
                        type: "input",
                        message: "How many items would you like to add?"
                    },
                ])
                    .then(function (answer) {

                        // when finished prompting, INSERT A NEW ITEM into the db with that info
                        connection.query(
                            "INSERT INTO products SET ?",
                            {
                                product_name: answer.item,
                                department_name: answer.department,
                                price: answer.price,
                                stock_quantity: answer.quantities
                            },
                            function (err) {
                                if (err) throw err;
                                console.log("New Product created successfully!");

                            });
                    });
            };
        });
});

