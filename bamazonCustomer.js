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

    console.log("......................ALL PRODUCTS.......................\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("id   Name    Department   Price    Quantyti in stock  ");
        console.log("------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "    " + res[i].product_name + "     " + res[i].department_name + "     " + res[i].price + "     " + res[i].stock_quantity);
            console.log("-----------------------------------------------------");
        }
        inquirer
            .prompt([{
                type: "input",
                message: "What is the ID of the product you would like to buy?",
                name: "id"
            }, {
                type: "input",
                message: "How many units of the product you would like to buy?",
                name: "units"
            }])
            .then(function(answer) {
                console.log("...........................................................\n");
                console.log("..................Checking customer's order.................\n");
                var sql = "SELECT stock_quantity, price, product_sales FROM products WHERE item_id=?";
                connection.query(
                    sql, [answer.id],
                    function(err, res) {
                        if (err) throw err;
                        if (res == "") {
                            console.log("Please, this product no exist in the database, sorry");
                            start();
                        }
                        if (res[0].stock_quantity >= answer.units) {

                            var cost = answer.units * res[0].price;
                            var revenue = res[0].product_sales + cost;
                            var inStock = res[0].stock_quantity - answer.units;
                            // Modify the products table so that there's a product_sales column and modify the bamazonCustomer.js app so that this value is updated with each individual products total revenue from each sale.
                            console.log("Update product in stock...\n");
                            connection.query(
                                "UPDATE products SET ? WHERE ?", [{
                                        stock_quantity: inStock,
                                        product_sales: revenue
                                    },
                                    {
                                        item_id: answer.id
                                    }
                                ],
                                function(err, res) {
                                    console.log("The cost of your purchase is: $" + cost + ".00");
                                    start();
                                }
                            );
                        }
                        if (res[0].stock_quantity < answer.units) {
                            console.log("Insufficient quantity!..\n");
                            start();
                        }
                    }
                );
            });
    });
}