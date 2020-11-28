const functions = require('firebase-functions');
exports.inventory = require('./inventory');
exports.transaction = require('./transaction');
// const express = require('express');
const cors = require('cors')({origin: true});
// const { extractInstanceAndPath } = require('firebase-functions/lib/providers/database');
var admin = require('firebase-admin');
const con = require('./mysql')
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// SELLER FUNCTIONS
exports.create_seller = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        let name = request.query.seller_name;
        let email = request.query.seller_email;
        res = [];

        con.query("INSERT INTO Seller (SellerName, SellerEmail) VALUES (?, ?);", [name, email], (err, rows, fields) => {
            if (!err) {
                res.push({ "Seller Id": rows.insertId, "Seller Name": name, "Seller Email": email });
                response.status(201).send(res);
            } else {
                response.status(400).send([{"Error Message" : "Failed to create Seller."}]);
            }
        })

    })
});

exports.retrieve_seller = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        let id = request.query.seller_id;
        let querystring = ``;

        if (id) {
            querystring = `SELECT s.SellerId AS "Seller Id", s.SellerName AS "Seller Name", s.SellerEmail AS "Seller Email", COALESCE(COUNT(e.SellerId), 0) AS "Sales to Employees"
            FROM Seller s LEFT OUTER JOIN EmployeePurchase e 
            ON e.SellerId = s.SellerId 
            GROUP BY s.SellerId, s.SellerName, s.SellerEmail
            HAVING s.SellerId = ?;`
        // Retrieve All
        } else {
            querystring = `SELECT s.SellerId AS "Seller Id", s.SellerName AS "Seller Name", s.SellerEmail AS "Seller Email", COALESCE(COUNT(e.SellerId), 0) AS "Sales to Employees"
            FROM Seller s LEFT OUTER JOIN EmployeePurchase e 
            ON e.SellerId = s.SellerId 
            GROUP BY s.SellerId, s.SellerName, s.SellerEmail;`;
        }
        con.query(querystring, [id], (err, rows, fields) => {
            if (!err) {
                response.status(200).send(rows);
            } else {
                response.status(400).send([{"Error Message" : "Failed to retrieve Seller(s)."}]);
            }
        })
    })
});


exports.update_seller = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        let id = request.query.seller_id;
        let new_name = request.query.seller_name;
        let new_email = request.query.seller_email;
        let sql;
        let preparedVariables;
        if (new_name && new_email) {
            sql = `UPDATE Seller SET SellerName = ?, SellerEmail = ? WHERE SellerId = ?;`
            preparedVariables = [new_name, new_email, id];
        } else if (new_name) {
            sql = `UPDATE Seller SET SellerName = ? WHERE SellerId = ?;`
            preparedVariables = [new_name, id];
        } else if (new_email) {
            sql = `UPDATE Seller SET SellerEmail = ? WHERE SellerId = ?;`
            preparedVariables = [new_email, id];
        } else {
            // Neither input
            response.status(400).send([{"Error Message" : "Please enter a new name or email!"}]);
            return;
        }

        con.query(sql, preparedVariables, (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send([{"Error Message" : "Failed to update Seller."}]);
            }
        })

    })
});


exports.delete_seller = functions.https.onRequest(async (request, response) => {
    
    cors(request, response, () => {
        let id = request.query.seller_id;

        if (!id) {
            response.status(400).send([{"Error Message" : `Please enter a Seller Id!`}]);
            return;
        }
        
        con.query(`DELETE FROM Seller WHERE SellerId = ?`, [id], (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send([{"Error Message" : `Cannot delete Seller ${id} because there are Transactions that include this seller.`}]);
            }
        })
    })
    
});


// EMPLOYEE FUNCTIONS
exports.create_employee = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        let name = request.query.employee_name;
        let email = request.query.employee_email;
        res = [];

        con.query(`INSERT INTO Employee (EmployeeName, EmployeeEmail) VALUES (?, ?);`, [name, email], (err, rows, fields) => {
            if (!err) {
                res.push({ "Employee Id": rows.insertId, "Employee Name": name, "Employee Email": email });
                response.status(201).send(res);
            } else {
                response.status(400).send([{"Error Message" : "Failed to create Employee."}]);
            }
        })

    })
});

exports.retrieve_employee = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        let id = request.query.employee_id;
        let querystring = ``;

        if (id) {
            // ID Passed, Return Specific
            querystring = `SELECT t1.EmployeeId AS "Employee Id", t1.EmployeeName AS "Employee Name", t1.EmployeeEmail AS "Employee Email", t1.Purchases AS "Purchases from Sellers", t2.Sales AS "Sales to Customers", t3.Refunds AS "Refunds Processed"
            FROM
            (SELECT e.EmployeeId, e.EmployeeName, e.EmployeeEmail, COALESCE(COUNT(ep.EmployeeId), 0) AS "Purchases"
            FROM Employee e LEFT OUTER JOIN EmployeePurchase ep 
            ON e.EmployeeId = ep.EmployeeId
            GROUP BY e.EmployeeId, e.EmployeeName, e.EmployeeEmail) t1 
            JOIN
            (SELECT e.EmployeeId, e.EmployeeName, e.EmployeeEmail, COALESCE(COUNT(co.EmployeeId), 0) AS "Sales"
            FROM Employee e LEFT OUTER JOIN CustomerOrder co 
            ON e.EmployeeId = co.EmployeeId
            GROUP BY e.EmployeeId, e.EmployeeName, e.EmployeeEmail) t2
            ON t1.EmployeeId = t2.EmployeeId
            JOIN
            (SELECT e.EmployeeId, e.EmployeeName, e.EmployeeEmail, COALESCE(COUNT(r.EmployeeId), 0) AS "Refunds"
            FROM Employee e LEFT OUTER JOIN CustomerRefund r
            ON e.EmployeeId = r.EmployeeId 
            GROUP BY e.EmployeeId, e.EmployeeName, e.EmployeeEmail) t3
            ON t1.EmployeeId = t3.EmployeeId
            WHERE t1.EmployeeId = ?;`;
        } else {
            // No ID Passed, Return All
            querystring = `SELECT t1.EmployeeId AS "Employee Id", t1.EmployeeName AS "Employee Name", t1.EmployeeEmail AS "Employee Email", t1.Purchases AS "Purchases from Sellers", t2.Sales AS "Sales to Customers", t3.Refunds AS "Refunds Processed"
            FROM
            (SELECT e.EmployeeId, e.EmployeeName, e.EmployeeEmail, COALESCE(COUNT(ep.EmployeeId), 0) AS "Purchases"
            FROM Employee e LEFT OUTER JOIN EmployeePurchase ep 
            ON e.EmployeeId = ep.EmployeeId
            GROUP BY e.EmployeeId, e.EmployeeName, e.EmployeeEmail) t1 
            JOIN
            (SELECT e.EmployeeId, e.EmployeeName, e.EmployeeEmail, COALESCE(COUNT(co.EmployeeId), 0) AS "Sales"
            FROM Employee e LEFT OUTER JOIN CustomerOrder co 
            ON e.EmployeeId = co.EmployeeId
            GROUP BY e.EmployeeId, e.EmployeeName, e.EmployeeEmail) t2
            ON t1.EmployeeId = t2.EmployeeId
            JOIN
            (SELECT e.EmployeeId, e.EmployeeName, e.EmployeeEmail, COALESCE(COUNT(r.EmployeeId), 0) AS "Refunds"
            FROM Employee e LEFT OUTER JOIN CustomerRefund r
            ON e.EmployeeId = r.EmployeeId 
            GROUP BY e.EmployeeId, e.EmployeeName, e.EmployeeEmail) t3
            ON t1.EmployeeId = t3.EmployeeId;`;
        }
        con.query(querystring, [id], (err, rows, fields) => {
            if (!err) {
                response.status(200).send(rows);
            } else {
                response.status(400).send([{"Error Message" : "Failed to retrieve Employee(s)."}]);
            }
        })

    })
});

exports.update_employee = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        let id = request.query.employee_id;
        let new_name = request.query.employee_name;
        let new_email = request.query.employee_email;
        let sql;
        let preparedVariables;
        if (new_name && new_email) {
            sql = `UPDATE Employee SET EmployeeName = ?, EmployeeEmail = ? WHERE EmployeeId = ?;`
            preparedVariables = [new_name, new_email, id];
        } else if (new_name) {
            sql = `UPDATE Employee SET EmployeeName = ? WHERE EmployeeId = ?;`
            preparedVariables = [new_name, id];
        } else if (new_email) {
            sql = `UPDATE Employee SET EmployeeEmail = ? WHERE EmployeeId = ?;`
            preparedVariables = [new_email, id];
        } else {
            // Neither input
            response.status(400).send([{"Error Message" : "Please enter a new name or email!"}]);
            return;
        }

        con.query(sql, preparedVariables, (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send([{"Error Message" : "Failed to update Employee."}]);
            }
        })

    })
});

exports.delete_employee = functions.https.onRequest(async (request, response) => {
    
    cors(request, response, () => {    
        let id = request.query.employee_id;
        
        if (!id) {
            response.status(400).send([{"Error Message" : `Please enter an Employee Id!`}]);
            return;
        }
        
        con.query(`DELETE FROM Employee WHERE EmployeeId = ?`, [id], (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send([{"Error Message" : `Cannot delete Employee ${id} because there are Transactions that include this employee.`}]);
            }
        })
    })
    
});

// CUSTOMER FUNCTIONS
exports.create_customer = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        let name = request.query.customer_name;
        let email = request.query.customer_email;
        res = [];

        con.query("INSERT INTO Customer (CustomerName, CustomerEmail) VALUES (?, ?);", [name, email], (err, rows, fields) => {
            if (!err) {
                res.push({ "Customer Id": rows.insertId, "Customer Name": name, "Customer Email": email });
                response.status(201).send(res);
            } else {
                response.status(400).send([{"Error Message" : "Failed to create Customer."}]);
            }
        })

    })
});

exports.retrieve_customer = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        let id = request.query.customer_id;
        let querystring = ``;

        if (id) {
            // ID Passed, Return Specific
            querystring = `SELECT t1.CustomerId AS "Customer Id", t1.CustomerName AS "Customer Name", t1.CustomerEmail AS "Customer Email", t1.Purchases AS "Purchases from Employees", t2.Refunds AS "Refunds Requested"
            FROM (SELECT c.CustomerId, c.CustomerName, c.CustomerEmail, COALESCE(COUNT(co.CustomerId), 0) AS "Purchases"
            FROM Customer c LEFT OUTER JOIN CustomerOrder co 
            ON c.CustomerId = co.CustomerId 
            GROUP BY c.CustomerId, c.CustomerName, c.CustomerEmail) t1 
            JOIN
            (SELECT c.CustomerId, c.CustomerName, c.CustomerEmail, COALESCE(COUNT(r.CustomerId), 0) AS "Refunds"
            FROM Customer c LEFT OUTER JOIN CustomerRefund r
            ON c.CustomerId = r.CustomerId 
            GROUP BY c.CustomerId, c.CustomerName, c.CustomerEmail) t2
            ON t1.CustomerId = t2.CustomerId
            WHERE t1.CustomerId = ?;`
        } else {
            // No ID Passed, Return All
            querystring = `SELECT t1.CustomerId AS "Customer Id", t1.CustomerName AS "Customer Name", t1.CustomerEmail AS "Customer Email", t1.Purchases AS "Purchases from Employees", t2.Refunds AS "Refunds Requested"
            FROM (SELECT c.CustomerId, c.CustomerName, c.CustomerEmail, COALESCE(COUNT(co.CustomerId), 0) AS "Purchases"
            FROM Customer c LEFT OUTER JOIN CustomerOrder co 
            ON c.CustomerId = co.CustomerId 
            GROUP BY c.CustomerId, c.CustomerName, c.CustomerEmail) t1 
            JOIN
            (SELECT c.CustomerId, c.CustomerName, c.CustomerEmail, COALESCE(COUNT(r.CustomerId), 0) AS "Refunds"
            FROM Customer c LEFT OUTER JOIN CustomerRefund r
            ON c.CustomerId = r.CustomerId 
            GROUP BY c.CustomerId, c.CustomerName, c.CustomerEmail) t2
            ON t1.CustomerId = t2.CustomerId;`
        }
        con.query(querystring, [id], (err, rows, fields) => {
            if (!err) {
                response.status(200).send(rows);
            } else {
                response.status(400).send([{"Error Message" : "Failed to retrieve Customer(s)."}]);
            }
        })

    })
});

exports.update_customer = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        let id = request.query.customer_id;
        let new_name = request.query.customer_name;
        let new_email = request.query.customer_email;
        let sql;
        let preparedVariables;
        if (new_name && new_email) {
            sql = `UPDATE Customer SET CustomerName = ?, CustomerEmail = ? WHERE CustomerId = ?;`
            preparedVariables = [new_name, new_email, id];
        } else if (new_name) {
            sql = `UPDATE Customer SET CustomerName = ? WHERE CustomerId = ?;`
            preparedVariables = [new_name, id];
        } else if (new_email) {
            sql = `UPDATE Customer SET CustomerEmail = ? WHERE CustomerId = ?;`
            preparedVariables = [new_email, id];
        } else {
            // Neither input
            response.status(400).send([{"Error Message" : "Please enter a new name or email!"}]);
            return;
        }

        con.query(sql, preparedVariables, (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send([{"Error Message" : "Failed to update Customer."}]);
            }
        })

    })
});

exports.delete_customer = functions.https.onRequest(async (request, response) => {
    
    cors(request, response, () => {
        let id = request.query.customer_id;
        
        if (!id) {
            response.status(400).send([{"Error Message" : `Please enter a Customer Id!`}]);
            return;
        }
        
        con.query(`DELETE FROM Customer WHERE CustomerId = ?`, [id], (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send([{"Error Message" : `Cannot delete Customer ${id} because there are Transactions that include this customer.`}]);
            }
        })
    })
    
});
