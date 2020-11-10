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
                res.push({ SellerId: rows.insertId, SellerName: name, SellerEmail: email });
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
            // ID Passed, Return Specific
            con.query(`SELECT * FROM Seller WHERE SellerId = ${id}`, (err, rows, fields) => {
                if (!err)
                    response.status(200).send(rows);
                else
                    response.status(400).send(err);
            })
        } else {
            // No ID Passed, Return All
            con.query('SELECT * FROM Seller', (err, rows, fields) => {
                if (!err)
                    response.status(200).send(rows);
                else
                    response.status(400).send(err);
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
                res.push({ EmployeeId: rows.insertId, EmployeeName: name, EmployeeEmail: email });
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
            con.query(`SELECT * FROM Employee WHERE EmployeeId = ${id}`, (err, rows, fields) => {
                if (!err)
                    response.status(200).send(rows);
                else
                    response.status(400).send(err);
            })
        } else {
            // No ID Passed, Return All
            con.query('SELECT * FROM Employee', (err, rows, fields) => {
                if (!err)
                    response.status(200).send(rows);
                else
                    response.status(400).send(err);
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
                res.push({ CustomerId: rows.insertId, CustomerName: name, CustomerEmail: email });
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
            con.query(`SELECT * FROM Customer WHERE CustomerId = ${id}`, (err, rows, fields) => {
                if (!err)
                    response.status(200).send(rows);
                else
                    response.status(400).send(err);
            })
        } else {
            // No ID Passed, Return All
            con.query('SELECT * FROM Customer', (err, rows, fields) => {
                if (!err)
                    response.status(200).send(rows);
                else
                    response.status(400).send(err);
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
