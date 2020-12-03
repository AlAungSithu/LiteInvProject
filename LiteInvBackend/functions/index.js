const functions = require('firebase-functions');
exports.inventory = require('./inventory');
exports.transaction = require('./transaction');
// const express = require('express');
const cors = require('cors')({origin: true});
// const { extractInstanceAndPath } = require('firebase-functions/lib/providers/database');
var admin = require('firebase-admin');
const con = require('./mysql')
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('LiteInv', 'admin', '256Team256', {
    host: 'liteinv.cwbgzf4cyva5.us-east-2.rds.amazonaws.com',
    dialect: 'mysql'
});
//SELLER model
const Seller = sequelize.define('Seller', {
        SellerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        SellerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        SellerEmail: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
    ,
    {
        tableName: 'Seller',
        createdAt: false,
        updatedAt: false
    });
//CUSTOMER model
const Customer = sequelize.define('Customer', {
        CustomerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        CustomerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        CustomerEmail: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
    ,
    {
        tableName: 'Customer',
        createdAt: false,
        updatedAt: false
    });
//EMPLOYEE model
const Employee = sequelize.define('Employee', {
        EmployeeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        EmployeeName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        EmployeeEmail: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
    ,
    {
        tableName: 'Employee',
        createdAt: false,
        updatedAt: false
    });
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

        sequelize.models.Seller.create({
            SellerName: name,
            SellerEmail: email
        }).then(function(seller) {
            Seller.findOne({attributes: ['SellerId'], where: {SellerEmail: email}}).then(sellerId => {
                res.push({ "Seller Id": sellerId.SellerId, "Seller Name": name, "Seller Email": email });
                response.status(201).send(res);
            })
            //const returnId = sequelize.models.Seller.max('SellerId');
        }).catch (function (e) {
            response.status(400).send([{"Error Message" : "Failed to create Seller."}]);
        });

    })
});

exports.retrieve_seller = functions.https.onRequest(async (request, response) => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
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
        if (new_name && new_email) {
            Seller.update(
                {SellerName: new_name, SellerEmail: new_email},{where: {SellerId: id}})
                .then(function(seller) {
                    response.sendStatus(200);
                }).catch (function (e) {
                response.status(400).send([{"Error Message" : "Failed to update Seller."}]);
            });
        } else if (new_name) {
            Seller.update(
                {SellerName: new_name},{where: {SellerId: id}})
                .then(function(seller) {
                    response.sendStatus(200);
                }).catch (function (e) {
                response.status(400).send([{"Error Message" : "Failed to update Seller."}]);
            });
        } else if (new_email) {
            Seller.update(
                {SellerEmail: new_email},{where: {SellerId: id}})
                .then(function(seller) {
                    response.sendStatus(200);
                }).catch (function (e) {
                response.status(400).send([{"Error Message" : "Failed to update Seller."}]);
            });
        } else {
            // Neither input
            response.status(400).send([{"Error Message" : "Please enter a new name or email!"}]);
            return;
        }

    })
});


exports.delete_seller = functions.https.onRequest(async (request, response) => {
    
    cors(request, response, () => {
        let id = request.query.seller_id;

        if (!id) {
            response.status(400).send([{"Error Message" : `Please HI enter a Seller Id!`}]);
            return;
        }

        Seller.destroy({
            where: {
                SellerId: id
            }

        }).then(function(seller) {
            response.sendStatus(200);
        }).catch(function (e) {
            response.status(400).send([{"Error Message" : `Cannot delete Seller ${id} because there are Transactions that include this seller.`}]);
        })

    })
    
});


// EMPLOYEE FUNCTIONS
exports.create_employee = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        let name = request.query.employee_name;
        let email = request.query.employee_email;
        res = [];

        sequelize.models.Employee.create({
            EmployeeName: name,
            EmployeeEmail: email
        }).then(function(employee) {
            Employee.findOne({attributes: ['EmployeeId'], where: {EmployeeEmail: email}}).then(employeeId => {
                res.push({ "Employee Id": employeeId.EmployeeId, "Employee Name": name, "Employee Email": email });
                response.status(201).send(res);
            })
        }).catch (function (e) {
            response.status(400).send([{"Error Message" : "Failed to create Employee."}]);
        });

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
        if (new_name && new_email) {
            Employee.update(
                {EmployeeName: new_name, EmployeeEmail: new_email},{where: {EmployeeId: id}})
                .then(function(employee) {
                    response.sendStatus(200);
                }).catch (function (e) {
                response.status(400).send([{"Error Message" : "Failed to update Employee."}]);
            });
        } else if (new_name) {
            Employee.update(
                {EmployeeName: new_name},{where: {EmployeeId: id}})
                .then(function(employee) {
                    response.sendStatus(200);
                }).catch (function (e) {
                response.status(400).send([{"Error Message" : "Failed to update Employee."}]);
            });
        } else if (new_email) {
            Employee.update(
                {EmployeeEmail: new_email},{where: {EmployeeId: id}})
                .then(function(employee) {
                    response.sendStatus(200);
                }).catch (function (e) {
                response.status(400).send([{"Error Message" : "Failed to update Employee."}]);
            });
        } else {
            // Neither input
            response.status(400).send([{"Error Message" : "Please enter a new name or email!"}]);
            return;
        }

    })
});

exports.delete_employee = functions.https.onRequest(async (request, response) => {
    
    cors(request, response, () => {    
        let id = request.query.employee_id;
        
        if (!id) {
            response.status(400).send([{"Error Message" : `Please enter an Employee Id!`}]);
            return;
        }

        Employee.destroy({
            where: {
                EmployeeId: id
            }

        }).then(function(employee) {
            response.sendStatus(200);
        }).catch(function (e) {
            response.status(400).send([{"Error Message" : `Cannot delete Employee ${id} because there are Transactions that include this employee.`}]);
        })
    })
    
});

// CUSTOMER FUNCTIONS
exports.create_customer = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
    
        let name = request.query.customer_name;
        let email = request.query.customer_email;
        res = [];

        sequelize.models.Customer.create({
            CustomerName: name,
            CustomerEmail: email
        }).then(function(customer) {
            Customer.findOne({attributes: ['CustomerId'], where: {CustomerEmail: email}}).then(customerId => {
                res.push({ "Customer Id": customerId.CustomerId, "Customer Name": name, "Customer Email": email });
                response.status(201).send(res);
            })
        }).catch (function (e) {
            response.status(400).send([{"Error Message" : "Failed to create Customer."}]);
        });

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
        if (new_name && new_email) {
            Customer.update(
                {CustomerName: new_name, CustomerEmail: new_email},{where: {CustomerId: id}})
                .then(function(customer) {
                    response.sendStatus(200);
                }).catch (function (e) {
                response.status(400).send([{"Error Message" : "Failed to update Customer."}]);
            });
        } else if (new_name) {
            Customer.update(
                {CustomerName: new_name},{where: {CustomerId: id}})
                .then(function(customer) {
                    response.sendStatus(200);
                }).catch (function (e) {
                response.status(400).send([{"Error Message" : "Failed to update Customer."}]);
            });
        } else if (new_email) {
            Customer.update(
                {CustomerEmail: new_email},{where: {CustomerId: id}})
                .then(function(customer) {
                    response.sendStatus(200);
                }).catch (function (e) {
                response.status(400).send([{"Error Message" : "Failed to update Customer."}]);
            });
        } else {
            // Neither input
            response.status(400).send([{"Error Message" : "Please enter a new name or email!"}]);
            return;
        }

    })
});

exports.delete_customer = functions.https.onRequest(async (request, response) => {
    
    cors(request, response, () => {
        let id = request.query.customer_id;
        
        if (!id) {
            response.status(400).send([{"Error Message" : `Please enter a Customer Id!`}]);
            return;
        }
        Customer.destroy({
            where: {
                CustomerId: id
            }

        }).then(function(customer) {
            response.sendStatus(200);
        }).catch(function (e) {
            response.status(400).send([{"Error Message" : `Cannot delete Customer ${id} because there are Transactions that include this customer.`}]);
        })

    })
    
});
