var inquirer = require("inquirer");
var mysql = require("mysql");
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
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?\n',
        choices: [
            'VIEW PRODUCTS FOR SALE', //if selected, list every item: id + name + price + quantity
            'VIEW LOW INVENTORY',  // if selected ,all items with count < 5
            'ADD TO INVENTORY',   // if selected, a prompt to add more of any item in store
            'ADD A PRODUCT',   // if selected, add a completely new product
        ],
    }).then(function (answer) {
        switch (answer.action) {
            case "VIEW PRODUCTS FOR SALE":
                viewProducts();
                break;
            case "VIEW LOW INVENTORY":
                viewInventory();
                break;
            case "ADD TO INVENTORY":
                addInventory();
                break;
            case "ADD A PRODUCT":
                addProduct();
                break;
        }
    });
};

function viewProducts() {
    console.log("Selecting all products...\n");
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
        console.log("-----------------------------------------------------------");
        start();
    });
};

function viewInventory() {
    console.log("Selecting inventory with stock < 5...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        var t = new Table;
        res.forEach(function (product) {
            t.cell('Item ID', product.item_id)
            t.cell('Product Name', product.product_name)
            t.cell('Department', product.department_name)
            t.cell('PriceUSD', product.price)
            t.cell('Quantity', product.stock_quantity)
            t.newRow()
        });
        console.log(t.toString());
        console.log("-----------------------------------------------------------");
        start();
    });
};

function addInventory() {
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
                // console.log(answer);
                // console.log(response);
                var product = response[answer.productId - 1];

                var addedQuantity = answer.addedQuantity;
                var addToStock = parseInt(product.stock_quantity) + parseInt(addedQuantity);
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: addToStock
                        },
                        {
                            item_id: answer.productId
                        }
                    ], function (err, response) {
                        if (err) throw err;
                        console.log(addedQuantity + " " + product.product_name + " " + "added to stock\n" + "Total items: " + addToStock);
                        console.log(response.affectedRows + " product updated!\n");
                        console.log("---------------------------------");
                        start();
                    }
                );
            });
    });
};

function addProduct() {
    console.log("new product");
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "What is the product's name?"
        },
        {
            name: "department",
            type: "input",
            message: "What is the product's department?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the product's price?",
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
            var prodSales = "0";
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.item,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantities,
                    product_sales: prodSales
                },
                function (err) {
                    if (err) throw err;
                    console.log("New Product created successfully!");
                    console.log("---------------------------------");
                    console.log(start());
                });
        });
};

