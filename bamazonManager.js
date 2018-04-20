var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,


    user: "root",


    password: "diana",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});


// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt([{
            type: "checkbox",
            message: "...................MENU OPTIONS...........................",
            choices: ["View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Close"
            ],
            name: "action"
        }])
        .then(function(answer) {
            console.log("..................Checking answer.................\n");
            var act = answer.action;
            if (act == "View Products for Sale") ViewProductsSale();
            if (act == "View Low Inventory") ViewLowInventory();
            if (act == "Add to Inventory") AddInventory();
            if (act == "Add New Product") AddNewProduct();
            if (act == "Close") connection.end();

        });
}

// "If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities",
function ViewProductsSale() {
    console.log("......................ALL PRODUCTS.......................\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("id   Name    Department   Price    Quantyti in stock  ");
        console.log("------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "    " + res[i].product_name + "     " + res[i].department_name + "     " + res[i].price + "     " + res[i].stock_quantity);
            console.log("-----------------------------------------------------");
        }
        start();
    });
}

function ViewLowInventory() {
    console.log(".................PRODUCTS LOW INVENTORY.....................\n");
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
        if (err) throw err;
        if (res == "") console.log("We don't have products with low inventory");
        console.log("id   Name    Department   Price    Quantyti in stock  ");
        console.log("------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "    " + res[i].product_name + "     " + res[i].department_name + "     " + res[i].price + "     " + res[i].stock_quantity);
            console.log("------------------------------------------------------");
        }
        start();
    });
}

function AddInventory() {
    var arr = [];

    connection.query("SELECT product_name FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement

        for (var i = 0; i < res.length; i++) {
            arr.push(res[i].product_name);
        }

        inquirer
            .prompt([{
                    type: "checkbox",
                    message: "What product in stock do you want to update?",
                    choices: arr,
                    name: "prod"
                },
                {
                    type: "input",
                    message: "How many do you want to increase?",
                    name: "count"
                }
            ]).then(function(response) {

                connection.query("SELECT stock_quantity FROM products WHERE ?", [{
                        product_name: response.prod
                    }], function(err, res) {
                        if (err) throw err;

                        var newCount = parseInt(response.count) + res[0].stock_quantity;

                        connection.query(
                            "UPDATE products SET ? WHERE ?", [{
                                    stock_quantity: newCount
                                },
                                {
                                    product_name: response.prod
                                }
                            ],
                            function(err, res) {
                                if (err) throw err;
                                console.log(res.affectedRows + " item updated!\n");
                                start();
                            }
                        );
                    }

                );
            });
    });
}

function AddNewProduct() {
    inquirer
        .prompt([{
                type: "input",
                message: "What is your name of the product?",
                name: "name"
            },
            {
                type: "input",
                message: "In what department do you locate it?",
                name: "department"
            },
            {
                type: "input",
                message: "what it is the price?",
                name: "price"
            }, {
                type: "input",
                message: "How many do you have?",
                name: "stock"
            }
        ])
        .then(function(response) {
            if (response.name != "" && response.department != "" && response.price !== "" &&
                response.stock !== "") {
                connection.query(
                    "INSERT INTO products SET ?", {
                        product_name: response.name,
                        department_name: response.department,
                        price: response.price,
                        stock_quantity: response.stock
                    },
                    function(err, res) {
                        console.log(res.affectedRows + " product inserted!\n");
                        console.log("......................................\n");
                    }
                );
            } else {
                console.log("Please, you must insert all caracteristic of the product..\n");
                AddNewProduct();
            }
            start();
        });

}