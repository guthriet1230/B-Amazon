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
  startManaging();
});

function startManaging(answer) {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "managingOptions",
        message: "What would you like to do?",
        choices: [
          "Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ]
      }
    ])
    .then(function(answer) {
      if (answer.managingOptions === "Products for Sale") {
        productSale();
      } else if (answer.managingOptions === "View Low Inventory") {
        lowInventory();
      } else if (answer.managingOptions === "Add to Inventory") {
        addInventory();
      } else if (answer.managingOptions === "Add New Product") {
        addProduct();
      }
    });
}

//* ///////////////////////////////////////////////////////////////////////////
//* PRODUCTS FOR SALE
//* ///////////////////////////////////////////////////////////////////////////
function productSale() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    console.log("\n");
    console.log("---------------------------------------------");
    console.log("PRODUCTS FOR SALE");
    console.log("---------------------------------------------");
    console.table(results);
    console.log("---------------------------------------------");

    connection.end();
  });
}

//* ///////////////////////////////////////////////////////////////////////////
//* LOW INVENTORY
//* ///////////////////////////////////////////////////////////////////////////
function lowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(
    err,
    results
  ) {
    if (err) throw err;
    console.log("\n");
    console.log("---------------------------------------------");
    console.log("LOW INVENTORY PRODUCTS");
    console.log("---------------------------------------------");
    console.table(results);
  });
  connection.end();
}

//* ///////////////////////////////////////////////////////////////////////////
//* ADD INVENTORY
//* ///////////////////////////////////////////////////////////////////////////
function addInventory() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    console.log("\n");
    console.log("---------------------------------------------");
    console.log("CURRENT INVENTORY");
    console.log("---------------------------------------------");
    console.table(results);
    console.log("---------------------------------------------");

    inquirer
      .prompt([
        {
          name: "product",
          type: "input",
          message:
            "What is the ID of the item you would like to add inventory to?",
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
          name: "additionInv",
          type: "input",
          message: "How much additional inventory would you like to add?",
          validate: function(value) {
            if (isNaN(value) === false && value != 0) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        // console.log(answer.product)
        // console.log(results);
        let productID = parseInt(answer.product);
        let productSelection = productID - 1;
        let additionalQuantity = parseInt(answer.additionInv);

        let productName = results[productSelection].product_name;
// console.log("productName: " + productName)
        console.log("---------------------------------------------");        
        console.log(
          "You've added " +
            additionalQuantity +
            " products to the " +
            productName +
            " inventory"
        );

        var newQuantity = (results[productSelection].stock_quantity += parseInt(
          answer.additionInv
        ));
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //! Need to properly update the inventory
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        console.log("---------------------------------------------");
        // console.log("productID: " + productID);
        // console.log("newQuantity: " + newQuantity);
        // console.log("---------------------------------------------");
        
    

        function updateInventory() {
          connection.query(
            'UPDATE products SET stock_quantity=stock_quantity+${results.quanitty} WHERE id=${results.productID}',
            function(err, results) {
              // if (err) throw err;
              console.log(results);
            }
          );
        }

        updateInventory();

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        console.log(
          "The " +
            productName + " (Product ID:" + productID +") new inventory total is: " +
            newQuantity +
            " items"
            
        );
     
      });
      // productSale()
    connection.end();
  });
}

//* ///////////////////////////////////////////////////////////////////////////
//* ADD PRODUCT
//* ///////////////////////////////////////////////////////////////////////////
function addProduct() {
  inquirer
    .prompt([
      {
        name: "productName",
        type: "input",
        message: "What is the name of the product you'd like to add?"
      },
      {
        name: "departmentName",
        type: "input",
        message: "What department would you like to add this product to?"
      },
      {
        name: "price",
        type: "input",
        message: "How much does this product cost?",
        validate: function(value) {
          if (isNaN(value) === false && value != 0) {
            return true;
          }
          return false;
        }
      },
      {
        name: "stockQuantity",
        type: "input",
        message: "how much inventory will you be adding?",
        validate: function(value) {
          if (isNaN(value) === false && value != 0) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      //
console.log(answer.productName);
      let addition =
        "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (" +
        answer.productName +
        ", " +
        answer.departmentName +
        ", " +
        answer.price +
        ", " +
        answer.stockQuantity +
        ")";

      connection.query(addition, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        console.table(result);
      });

      connection.end();
    });
}