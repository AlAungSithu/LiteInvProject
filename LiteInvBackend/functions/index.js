const functions = require('firebase-functions');
exports.inventory = require('./inventory');
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

        con.query(`INSERT INTO Seller (SellerName, SellerEmail) VALUES ("${name}", "${email}");`, (err, rows, fields) => {
            if (!err) {
                res.push({ "Seller Id": rows.insertId, "Seller Name": name, "Seller Email": email });
                response.status(201).send(res);
            } else {
                response.status(400).send(err);
            }
        })

    })
});

exports.retrieve_seller = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        let id = request.query.seller_id;

        if (id) {
            querystring = `SELECT s.SellerId AS "Seller Id", s.SellerName AS "Seller Name", s.SellerEmail AS "Seller Email", COALESCE(COUNT(e.SellerId), 0) AS "Sales to Employees"
            FROM Seller s LEFT OUTER JOIN EmployeePurchase e 
            ON e.SellerId = s.SellerId 
            GROUP BY s.SellerId, s.SellerName, s.SellerEmail
            HAVING s.SellerId = ${id};`
            con.query(querystring, (err, rows, fields) => {
                if (!err) {
                    response.status(200).send(rows);
                } else {
                    response.status(400).send(err);
                }
            })

        // Retrieve All
        } else {
            querystring = `SELECT s.SellerId AS "Seller Id", s.SellerName AS "Seller Name", s.SellerEmail AS "Seller Email", COALESCE(COUNT(e.SellerId), 0) AS "Sales to Employees"
            FROM Seller s LEFT OUTER JOIN EmployeePurchase e 
            ON e.SellerId = s.SellerId 
            GROUP BY s.SellerId, s.SellerName, s.SellerEmail;`;
            con.query(querystring, (err, rows, fields) => {
                if (!err) {
                    response.status(200).send(rows);
                } else {
                    response.status(400).send(err);
                }
            })
        }
    })
});


exports.update_seller = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        let id = request.query.seller_id;
        let new_name = request.query.seller_name;
        let new_email = request.query.seller_email;
        let sql;
        if (new_name && new_email) {
            sql = `UPDATE Seller SET SellerName = "${new_name}", SellerEmail = "${new_email}" WHERE SellerId = "${id}";`
        } else if (new_name) {
            sql = `UPDATE Seller SET SellerName = "${new_name}" WHERE SellerId = "${id}";`
        } else if (new_email) {
            sql = `UPDATE Seller SET SellerEmail = "${new_email}" WHERE SellerId = "${id}";`
        } else {
            // Neither input - Should never happen
            response.status(400).send(err);
        }

        con.query(sql, (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send(err);
            }
        })

    })
});


exports.delete_seller = functions.https.onRequest(async (request, response) => {
    
    cors(request, response, () => {
        let id = request.query.seller_id;
        
        con.query(`DELETE FROM Seller WHERE SellerId = ${id}`, (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send(err);
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

        con.query(`INSERT INTO Employee (EmployeeName, EmployeeEmail) VALUES ("${name}", "${email}");`, (err, rows, fields) => {
            if (!err) {
                res.push({ "Employee Id": rows.insertId, "Employee Name": name, "Employee Email": email });
                response.status(201).send(res);
            } else {
                response.status(400).send(err);
            }
        })

    })
});

exports.retrieve_employee = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        let id = request.query.employee_id;

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
            WHERE t1.EmployeeId = ${id};`;
            con.query(querystring, (err, rows, fields) => {
                if (!err) {
                    response.status(200).send(rows);
                } else {
                    response.status(400).send(err);
                }
            })
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
            con.query(querystring, (err, rows, fields) => {
                if (!err) {
                    response.status(200).send(rows);
                } else {
                    response.status(400).send(err);
                }
            })
        }

    })
});

exports.update_employee = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        let id = request.query.employee_id;
        let new_name = request.query.employee_name;
        let new_email = request.query.employee_email;
        let sql;
        if (new_name && new_email) {
            sql = `UPDATE Employee SET EmployeeName = "${new_name}", EmployeeEmail = "${new_email}" WHERE EmployeeId = "${id}";`
        } else if (new_name) {
            sql = `UPDATE Employee SET EmployeeName = "${new_name}" WHERE EmployeeId = "${id}";`
        } else if (new_email) {
            sql = `UPDATE Employee SET EmployeeEmail = "${new_email}" WHERE EmployeeId = "${id}";`
        } else {
            // Neither input
            response.status(400).send(err);
        }

        con.query(sql, (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send(err);
            }
        })

    })
});

exports.delete_employee = functions.https.onRequest(async (request, response) => {
    
    cors(request, response, () => {    
        let id = request.query.employee_id;
        
        if (!id) {
            res = [];
            res.push({Success: false})
            response.send(res);
        }
        
        con.query(`DELETE FROM Employee WHERE EmployeeId = ${id}`, (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send(err);
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

        con.query(`INSERT INTO Customer (CustomerName, CustomerEmail) VALUES ("${name}", "${email}");`, (err, rows, fields) => {
            if (!err) {
                res.push({ "Customer Id": rows.insertId, "Customer Name": name, "Customer Email": email });
                response.status(201).send(res);
            } else {
                response.status(400).send(err);
            }
        })

    })
});

exports.retrieve_customer = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        let id = request.query.customer_id;

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
            WHERE t1.CustomerId = ${id};`
            con.query(querystring, (err, rows, fields) => {
                if (!err) {
                    response.status(200).send(rows);
                } else {
                    response.status(400).send(err);
                }
            })
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

            con.query(querystring, (err, rows, fields) => {
                if (!err) {
                    response.status(200).send(rows);
                } else {
                    response.status(400).send(err);
                }
            })
        }

    })
});

exports.update_customer = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        let id = request.query.customer_id;
        let new_name = request.query.customer_name;
        let new_email = request.query.customer_email;
        let sql;
        if (new_name && new_email) {
            sql = `UPDATE Customer SET CustomerName = "${new_name}", CustomerEmail = "${new_email}" WHERE CustomerId = "${id}";`
        } else if (new_name) {
            sql = `UPDATE Customer SET CustomerName = "${new_name}" WHERE CustomerId = "${id}";`
        } else if (new_email) {
            sql = `UPDATE Customer SET CustomerEmail = "${new_email}" WHERE CustomerId = "${id}";`
        } else {
            // Neither input
            response.status(400).send(err);
        }

        con.query(sql, (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send(err);
            }
        })

    })
});

exports.delete_customer = functions.https.onRequest(async (request, response) => {
    
    cors(request, response, () => {
        let id = request.query.customer_id;
        
        if (!id) {
            res = [];
            res.push({Success: false})
            response.send(res);
        }
        
        con.query(`DELETE FROM Customer WHERE CustomerId = ${id}`, (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send(err);
            }
        })
    })
    
});
