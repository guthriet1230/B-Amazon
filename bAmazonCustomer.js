const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

//* ///////////////////////////////////////////////////////////////////////////
//* Connection
//* ///////////////////////////////////////////////////////////////////////////
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "California1!",
  database: "bAmazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  startPurchase();
});

//* ///////////////////////////////////////////////////////////////////////////
//* start Purchase
//* ///////////////////////////////////////////////////////////////////////////
function startPurchase(answer) {
  inquirer
    .prompt([
      {
        name: "bAmazonYN",
        type: "confirm",
        message: "You're about to enter B-Amazon. Would you like to continue?",
        default: false
      }
    ])
    .then(function(answer) {
      // console.log(answer);
      if (answer.bAmazonYN === true) {
        findItem();
      } else {
        console.log("-------------------------------");
        console.log("Have a great day!");
        console.log("-------------------------------");
        connection.end();
      }
    });
}

//* ///////////////////////////////////////////////////////////////////////////
//* Ordering
//* ///////////////////////////////////////////////////////////////////////////

function findItem() {
  // console.log("Connected");
  connection.query("SELECT * FROM products", function(err, results) {
    // console.log(results);
    console.log('\n');
    console.log("---------------------------------------------");
    console.log("B-AMAZON INVENTORY");
    console.log("---------------------------------------------");
    console.table(results);
    console.log("---------------------------------------------");
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "product",
          type: "input",
          message: "What is the ID of the item you would like to purchase?",
          validate: function(value) {
            if (
              isNaN(value) === false &&
              value <= results.length &&
              value != 0
            ) {
              return true;
            } else {
              return false;
            }
          }
        },
        {
          name: "stock",
          type: "input",
          message: "How many would you like?",
          validate: function(value) {
            if (isNaN(value) === false && value != 0) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        console.log("---------------------------------------------");
        // console.log(answer.productID);
        // console.log(answer.stock);
        var productID = parseInt(answer.product);
        
        // console.log(productID);
        var productName = results.productName;
        connection.query(
          "SELECT * FROM products WHERE id=" + productID,
          function(err, results) {
            if (err) throw err;

            var product = results[0].product_name;
            var productCost = results[0].price;
            var quantity = parseInt(results[0].stock_quantity);
            let requestedQuantity = parseInt(answer.stock);
            //* ///////////////////////////////////////////////////////////////////////////
            //* Confirm Order
            //* ///////////////////////////////////////////////////////////////////////////
            inquirer
              .prompt([
                {
                  name: "confirmation",
                  type: "confirm",
                  message:
                    "You would like to purchase " +
                    answer.stock +
                    " " +
                    product +
                    " is this correct?",
                  default: false
                }
              ])
              .then(function(answer) {
                if (answer.confirmation === true) {
                  // console.log(requestedQuantity);
                  // console.log(quantity);
                  if (requestedQuantity <= quantity) {
                    // checkout();
                    // console.log("quantity1: " + quantity);
                    // console.log("answer_stock: (now quantity) ", (requestedQuantity + 1));
                    let newQuantity = quantity - requestedQuantity;
                    console.log("new QUANTITY: " + newQuantity);
                    // console.log("requestedQuantity" + requestedQuantity)
                    // console.log(newQuantity);
                    let totalCost = (requestedQuantity * productCost).toFixed(2);


                    console.log('\n');
                    console.log("-----------------------------------");
                    console.log(
                      "Total Cost is: $" + totalCost
                    );
                    console.log("-----------------------------------")
                    updateInventory();
            //* ///////////////////////////////////////////////////////////////////////////
            //* Update Inventory 
            //* ///////////////////////////////////////////////////////////////////////////
            function updateInventory() {
              console.log("New Inventory for " + product+ ": " + newQuantity + " units");
              connection.query(
                "UPDATE products SET stock_quantity=" +
                //!!!!! use question marks
                  newQuantity +
                  " WHERE id=" +
                  productID,
                function(err, results) {
                  if (err) throw err;

        
                  console.log("(Records updated - " + newQuantity+ " units)");
                  console.log("\n" + "********************************");
                  console.log(" ___________THANKS!____________");
                  console.log(" _________COME_AGAIN!__________");
                  console.log("********************************" + "\n");
                  connection.end();
                }
              );
            }
         
                  } else {
                    console.log("-------------------------------");
                    console.log("We dont have many in stock");
                    console.log("Try ordering again");
                    console.log("-------------------------------");
                    connection.end();
                  }
                } else {
                  console.log("-------------------------------");
                  console.log("Try ordering again!");
                  console.log("-------------------------------");
                  connection.end();
                }
              });

            //* ///////////////////////////////////////////////////////////////////////////
            //* Checkout (function)
            //* ///////////////////////////////////////////////////////////////////////////

          }
        );

        //?

        // connection.end();
      });
  });
}

// function updateInventory(){
//     connection.query(
//                 "UPDATE products SET stock_quantity=" + newQuantity + " WHERE id=" + productID, function(err, res) {
//               console.log(res);
//             });
// }
