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

function start() {
    inquirer
        .prompt([{
            type: "checkbox",
            message: "...................MENU OPTIONS...........................",
            choices: ["View Product Sales by Department",
                "Create New Department",
                "Close"
            ],
            name: "action"
        }])
        .then(function(answer) {
            console.log("..................Checking answer.................\n");
            var act = answer.action;
            if (act == "View Product Sales by Department") ViewProductsSaleDepartment();
            if (act == "Create New Department") CreateDepartment();
            if (act == "Close") connection.end();
        });
}

function ViewProductsSaleDepartment() {

    var query = "SELECT departments.department_id, departments.department_name,departments. over_head_costs, products.product_sales, products.product_sales- departments. over_head_costs as total_profit";
    query += " FROM departments INNER JOIN products on departments.department_name=products.department_name GROUP BY department_name";
    connection.query(query, function(err, res) {
        if (err) throw err;

        console.log("Department_id Department_name Over_head-cost Product_sales Total_Profit");
        console.log("-----------------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {

            console.log("     " + res[i].department_id + "           " + res[i].department_name + "         " + res[i].over_head_costs + "            " + res[i].product_sales + "        " + res[i].total_profit);
            console.log("----------------------------------------------------------------");
        }
        start();
    });
}

function CreateDepartment() {
    inquirer
        .prompt([{
                type: "input",
                message: "What is your name of the department?",
                name: "name"
            },
            {
                type: "input",
                message: "what is the over head cost?",
                name: "cost"
            }
        ])
        .then(function(response) {
            if (response.name != "" && response.cost != "") {
                connection.query(
                    "INSERT INTO departments SET ?", {
                        department_name: response.name,
                        over_head_costs: response.cost
                    },
                    function(err, res) {
                        console.log(res.affectedRows + " department inserted!...\n");
                        console.log("............................................\n");
                        start();
                    }
                );
            } else {
                console.log("Please, you must insert all caracteristic of the department..\n");
                CreateDepartment();
            }

        });

}