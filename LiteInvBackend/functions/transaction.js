const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const con = require('./mysql')

// EMPLOYEE PURCHASE
exports.create_purchase = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
        // Get Inputs
        let item_id = request.query.item_id;
        let employee_id = request.query.employee_id;
        let seller_id = request.query.seller_id;
        let amount = request.query.amount;

        // Creation
        let querystring = `INSERT INTO EmployeePurchase(ItemId, EmployeeId, SellerId, Amount, PurchaseDate) VALUES(${item_id}, ${employee_id}, ${seller_id}, ${amount}, CURDATE());`;
        con.query(querystring, (err1, rows1, fields1) => {
            if (err1) {
                response.status(400).send(err1.sqlMessage);
            } else {
                let purchase_id = rows1.insertId;
                let queryselect = `SELECT ItemId AS "Item Id", EmployeeId AS "Employee Id", SellerId AS "Seller Id", Amount, PurchaseDate AS "Purchase Date"
                 FROM EmployeePurchase WHERE PurchaseId = ${purchase_id};`;
                con.query(queryselect, (err2, rows2, fields2) => {
                    if (err2) {
                        response.status(400).send(err2.sqlMessage);
                    }
                    response.status(201).send(rows2);
                })
            }
        })
        
    })
});

exports.retrieve_purchase = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
        let purchase_id = request.query.purchase_id;
        let querystring = ``;

        // Retrieve ID
        if (purchase_id) {
            querystring = `SELECT ep.PurchaseId AS "Purchase Id", ep.ItemId AS "Item Id", i.ItemName AS "Item Name",
            ep.EmployeeId AS "Employee Id", e.EmployeeName AS "Employee Name",
            ep.SellerId AS "Seller Id", s.SellerName AS "Seller Name",
            ep.Amount, 
            ep.PurchaseDate AS "Purchase Date"
            FROM EmployeePurchase ep JOIN Inventory i
            ON ep.ItemId = i.ItemId
            JOIN Employee e
            ON ep.EmployeeId = e.EmployeeId
            JOIN Seller s
            ON ep.SellerId = s.SellerId
            WHERE PurchaseId = ${purchase_id};`;
        // Retrieve All
        } else {
            querystring = `SELECT ep.PurchaseId AS "Purchase Id", ep.ItemId AS "Item Id", i.ItemName AS "Item Name",
            ep.EmployeeId AS "Employee Id", e.EmployeeName AS "Employee Name",
            ep.SellerId AS "Seller Id", s.SellerName AS "Seller Name",
            ep.Amount, 
            ep.PurchaseDate AS "Purchase Date"
            FROM EmployeePurchase ep JOIN Inventory i
            ON ep.ItemId = i.ItemId
            JOIN Employee e
            ON ep.EmployeeId = e.EmployeeId
            JOIN Seller s
            ON ep.SellerId = s.SellerId;`;
        }

        con.query(querystring, (err, rows, fields) => {
            if (!err) {
                response.status(200).send(rows);
            } else {
                response.status(400).send(err.sqlMessage);
            }
        })

    })
});



// CUSTOMER ORDER
exports.create_order = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
        // Get Inputs
        let item_id = request.query.item_id;
        let customer_id = request.query.customer_id;
        let employee_id = request.query.employee_id;
        let amount = request.query.amount;

        // Validation Checks


        // Creation

    })
});

exports.retrieve_order = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
        let order_id = request.query.order_id;
        let querystring = ``;

        // Retrieve ID
        if (order_id) {
            querystring = `SELECT o.OrderId AS "Order Id", o.ItemId AS "Item Id", i.ItemName AS "Item Name",
            o.EmployeeId AS "Employee Id", e.EmployeeName AS "Employee Name",
            o.CustomerId AS "Customer Id", c.CustomerName AS "Customer Name",
            o.Amount, 
            o.OrderDate AS "Order Date"
            FROM CustomerOrder o JOIN Inventory i
            ON o.ItemId = i.ItemId
            JOIN Employee e
            ON o.EmployeeId = e.EmployeeId
            JOIN Customer c
            ON o.CustomerId = c.CustomerId
            WHERE OrderId = ${order_id};`;
        // Retrieve All
        } else {
            querystring = `SELECT o.OrderId AS "Order Id", o.ItemId AS "Item Id", i.ItemName AS "Item Name",
            o.EmployeeId AS "Employee Id", e.EmployeeName AS "Employee Name",
            o.CustomerId AS "Customer Id", c.CustomerName AS "Customer Name",
            o.Amount, 
            o.OrderDate AS "Order Date"
            FROM CustomerOrder o JOIN Inventory i
            ON o.ItemId = i.ItemId
            JOIN Employee e
            ON o.EmployeeId = e.EmployeeId
            JOIN Customer c
            ON o.CustomerId = c.CustomerId;`;
        }

        con.query(querystring, (err, rows, fields) => {
            if (!err) {
                response.status(200).send(rows);
            } else {
                response.status(400).send(err.sqlMessage);
            }
        })

    })
});



// CUSTOMER REFUND
exports.create_refund = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
        // Get Inputs
        let item_id = request.query.item_id;
        let customer_id = request.query.customer_id;
        let employee_id = request.query.employee_id;
        let amount = request.query.amount;

        // Validation Checks


        // Creation

    })
});

exports.retrieve_refund = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
        let refund_id = request.query.refund_id;
        let querystring = ``;

        // Retrieve ID
        if (refund_id) {
            querystring = `SELECT r.RefundId AS "Refund Id", r.ItemId AS "Item Id", i.ItemName AS "Item Name",
            r.EmployeeId AS "Employee Id", e.EmployeeName AS "Employee Name",
            r.CustomerId AS "Customer Id", c.CustomerName AS "Customer Name",
            r.Amount, 
            r.RefundDate AS "Refund Date"
            FROM CustomerRefund r JOIN Inventory i
            ON r.ItemId = i.ItemId
            JOIN Employee e
            ON r.EmployeeId = e.EmployeeId
            JOIN Customer c
            ON r.CustomerId = c.CustomerId
            WHERE RefundId = ${refund_id};`;
        // Retrieve All
        } else {
            querystring = `SELECT r.RefundId AS "Refund Id", r.ItemId AS "Item Id", i.ItemName AS "Item Name",
            r.EmployeeId AS "Employee Id", e.EmployeeName AS "Employee Name",
            r.CustomerId AS "Customer Id", c.CustomerName AS "Customer Name",
            r.Amount, 
            r.RefundDate AS "Refund Date"
            FROM CustomerRefund r JOIN Inventory i
            ON r.ItemId = i.ItemId
            JOIN Employee e
            ON r.EmployeeId = e.EmployeeId
            JOIN Customer c
            ON r.CustomerId = c.CustomerId;`;
        }

        con.query(querystring, (err, rows, fields) => {
            if (!err) {
                response.status(200).send(rows);
            } else {
                response.status(400).send(err.sqlMessage);
            }
        })

    })
});
