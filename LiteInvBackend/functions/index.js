const functions = require('firebase-functions');
// const express = require('express');
const cors = require('cors')({origin: true});
const mysql = require('mysql');
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
    
        /* FORMAT
            "Success": true/false,
            "SellerId": inserted id     OR      -1 on Success == false,
            "SellerName": "name sent to backend",
            "SellerEmail": "email sent to backend"
        */
        let name = request.query.seller_name;
        let email = request.query.seller_email;
        res = [];

        con.query(`INSERT INTO Seller (SellerName, SellerEmail) VALUES ("${name}", "${email}");`, (err, rows, fields) => {
            if (!err) {
                res.push({Success: true, SellerId: rows.insertId, SellerName: name, SellerEmail: email});
                response.send(res);
            } else {
                res.push({Success: false, SellerId: -1, SellerName: name, SellerEmail: email});
                response.send(res);
            }
        })

    })
});

exports.retrieve_seller = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        /* FORMAT
            ON SUCCESS - person with that id found
                "SellerId": retrieved-id,
                "SellerName": "retrieved-name",
                "SellerEmail": "retrieved-email"
            ON FAILURE - no person with that id found
                Blank
        */
        let id = request.query.seller_id;
        if (id) {
            // ID Passed, Return Specific
            con.query(`SELECT * FROM Seller WHERE SellerId = ${id}`, (err, rows, fields) => {
                if (!err)
                    response.send(rows);
                else
                    response.send();
            })
        } else {
            // No ID Passed, Return All
            con.query('SELECT * FROM Seller', (err, rows, fields) => {
                if (!err)
                    response.send(rows);
                else
                    response.send();
            })
        }

    })
});


exports.update_seller = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        /* FORMAT
            "Success": true/false
        */
        let id = request.query.seller_id;
        let new_name = request.query.seller_name;
        let new_email = request.query.seller_email;
        let sql;
        res = [];
        if (new_name && new_email) {
            sql = `UPDATE Seller SET SellerName = "${new_name}", SellerEmail = "${new_email}" WHERE SellerId = "${id}";`
        } else if (new_name) {
            sql = `UPDATE Seller SET SellerName = "${new_name}" WHERE SellerId = "${id}";`
        } else if (new_email) {
            sql = `UPDATE Seller SET SellerEmail = "${new_email}" WHERE SellerId = "${id}";`
        } else {
            // Neither input
            res.push({Success: false})
            response.send(res);
        }

        con.query(sql, (err, rows, fields) => {
            if (!err) {
                res = [];
                res.push({Success: true})
                response.send(res);
            } else {
                res = [];
                res.push({Success: false})
                response.send(res);
            }
        })

    })
});


exports.delete_seller = functions.https.onRequest(async (request, response) => {
    
    cors(request, response, () => {
        /* FORMAT
            "Success": true/false
        */
        let id = request.query.seller_id;
        
        if (!id) {
            res = [];
            res.push({Success: false})
            response.send(res);
        }
        
        con.query(`DELETE FROM Seller WHERE SellerId = ${id}`, (err, rows, fields) => {
            affectedRows = rows.affectedRows;
            if (!err) {
                res = [];
                if (affectedRows) {
                    res.push({Success: true})
                } else {
                    res.push({Success: false})
                }
                response.send(res);
            }
            else
                res.push({Success: false})
                response.send(res);
        })
    })
    
});


// EMPLOYEE FUNCTIONS
exports.create_employee = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        /* FORMAT
            "Success": true/false,
            "EmployeeId": inserted id     OR      -1 on Success == false,
            "EmployeeName": "name sent to backend",
            "EmployeeEmail": "email sent to backend"
        */
        let name = request.query.employee_name;
        let email = request.query.employee_email;
        res = [];

        con.query(`INSERT INTO Employee (EmployeeName, EmployeeEmail) VALUES ("${name}", "${email}");`, (err, rows, fields) => {
            if (!err) {
                res.push({Success: true, EmployeeId: rows.insertId, EmployeeName: name, EmployeeEmail: email});
                response.send(res);
            } else {
                res.push({Success: false, EmployeeId: -1, EmployeeName: name, EmployeeEmail: email});
                response.send(res);
            }
        })

    })
});

exports.retrieve_employee = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        /* FORMAT
            ON SUCCESS - person with that id found
                "EmployeeId": retrieved-id,
                "EmplyeeName": "retrieved-name",
                "EmployeeEmail": "retrieved-email"
            ON FAILURE - no person with that id found
                Blank
        */
        let id = request.query.employee_id;
        if (id) {
            // ID Passed, Return Specific
            con.query(`SELECT * FROM Employee WHERE EmployeeId = ${id}`, (err, rows, fields) => {
                if (!err)
                    response.send(rows);
                else
                    response.send();
            })
        } else {
            // No ID Passed, Return All
            con.query('SELECT * FROM Employee', (err, rows, fields) => {
                if (!err)
                    response.send(rows);
                else
                    response.send();
            })
        }

    })
});

exports.update_employee = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        /* FORMAT
            "Success": true/false
        */
        let id = request.query.employee_id;
        let new_name = request.query.employee_name;
        let new_email = request.query.employee_email;
        let sql;
        res = [];
        if (new_name && new_email) {
            sql = `UPDATE Employee SET EmployeeName = "${new_name}", EmployeeEmail = "${new_email}" WHERE EmployeeId = "${id}";`
        } else if (new_name) {
            sql = `UPDATE Employee SET EmployeeName = "${new_name}" WHERE EmployeeId = "${id}";`
        } else if (new_email) {
            sql = `UPDATE Employee SET EmployeeEmail = "${new_email}" WHERE EmployeeId = "${id}";`
        } else {
            // Neither input
            res.push({Success: false})
            response.send(res);
        }

        con.query(sql, (err, rows, fields) => {
            if (!err) {
                res = [];
                res.push({Success: true})
                response.send(res);
            } else {
                res = [];
                res.push({Success: false})
                response.send(res);
            }
        })

    })
});

exports.delete_employee = functions.https.onRequest(async (request, response) => {
    
    cors(request, response, () => {
        /* FORMAT
            "Success": true/false
        */
        let id = request.query.employee_id;
        
        if (!id) {
            res = [];
            res.push({Success: false})
            response.send(res);
        }
        
        con.query(`DELETE FROM Employee WHERE EmployeeId = ${id}`, (err, rows, fields) => {
            affectedRows = rows.affectedRows;
            if (!err) {
                res = [];
                if (affectedRows) {
                    res.push({Success: true})
                } else {
                    res.push({Success: false})
                }
                response.send(res);
            }
            else
                res.push({Success: false})
                response.send(res);
        })
    })
    
});

// CUSTOMER FUNCTIONS
exports.create_customer = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        /* FORMAT
            "Success": true/false,
            "CustomerId": inserted id     OR      -1 on Success == false,
            "CustomerName": "name sent to backend",
            "CustomerEmail": "email sent to backend"
        */
        let name = request.query.customer_name;
        let email = request.query.customer_email;
        res = [];

        con.query(`INSERT INTO Customer (CustomerName, CustomerEmail) VALUES ("${name}", "${email}");`, (err, rows, fields) => {
            if (!err) {
                res.push({Success: true, CustomerId: rows.insertId, CustomerName: name, CustomerEmail: email});
                response.send(res);
            } else {
                res.push({Success: false, CustomerId: -1, CustomerName: name, CustomerEmail: email});
                response.send(res);
            }
        })

    })
});

exports.retrieve_customer = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        /* FORMAT
            ON SUCCESS - person with that id found
                "CustomerId": retrieved-id,
                "CustomerName": "retrieved-name",
                "CustomerEmail": "retrieved-email"
            ON FAILURE - no person with that id found
                Blank
        */
        let id = request.query.customer_id;
        if (id) {
            // ID Passed, Return Specific
            con.query(`SELECT * FROM Customer WHERE CustomerId = ${id}`, (err, rows, fields) => {
                if (!err)
                    response.send(rows);
                else
                    response.send();
            })
        } else {
            // No ID Passed, Return All
            con.query('SELECT * FROM Customer', (err, rows, fields) => {
                if (!err)
                    response.send(rows);
                else
                    response.send();
            })
        }

    })
});

exports.update_customer = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        /* FORMAT
            "Success": true/false
        */
        let id = request.query.customer_id;
        let new_name = request.query.customer_name;
        let new_email = request.query.customer_email;
        let sql;
        res = [];
        if (new_name && new_email) {
            sql = `UPDATE Customer SET CustomerName = "${new_name}", CustomerEmail = "${new_email}" WHERE CustomerId = "${id}";`
        } else if (new_name) {
            sql = `UPDATE Customer SET CustomerName = "${new_name}" WHERE CustomerId = "${id}";`
        } else if (new_email) {
            sql = `UPDATE Customer SET CustomerEmail = "${new_email}" WHERE CustomerId = "${id}";`
        } else {
            // Neither input
            res.push({Success: false})
            response.send(res);
        }

        con.query(sql, (err, rows, fields) => {
            if (!err) {
                res = [];
                res.push({Success: true})
                response.send(res);
            } else {
                res = [];
                res.push({Success: false})
                response.send(res);
            }
        })

    })
});

exports.delete_customer = functions.https.onRequest(async (request, response) => {
    
    cors(request, response, () => {
        /* FORMAT
            "Success": true/false
        */
        let id = request.query.customer_id;
        
        if (!id) {
            res = [];
            res.push({Success: false})
            response.send(res);
        }
        
        con.query(`DELETE FROM Customer WHERE CustomerId = ${id}`, (err, rows, fields) => {
            affectedRows = rows.affectedRows;
            if (!err) {
                res = [];
                if (affectedRows) {
                    res.push({Success: true})
                } else {
                    res.push({Success: false})
                }
                response.send(res);
            }
            else
                res.push({Success: false})
                response.send(res);
        })
    })
    
});
