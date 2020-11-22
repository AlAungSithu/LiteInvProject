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
        let purchase_id;

        if (amount <= 0) {
            response.status(400).send([{"Error Message" : "Please enter an amount greater than 0!"}]);
            return;
        }

        // Start Transaction
        let queryset = "START TRANSACTION;";
        con.query(queryset, (err1, rows1, fields1) => {

            // Create Item
            let querystring = `INSERT INTO EmployeePurchase(ItemId, EmployeeId, SellerId, Amount, PurchaseDate) VALUES(${item_id}, ${employee_id}, ${seller_id}, ${amount}, CURDATE());`;
            con.query(querystring, (err1, rows1, fields1) => {
                if (err1) {
                    response.status(400).send([{"Error Message": "Failed to create Employee Purchase. Please ensure that the Item, Seller, and Employee exist."}]);
                    con.query("ROLLBACK;");

                } else {

                    // Updates ItemCount in Inventory
                    purchase_id = rows1.insertId;
                    let queryupdate = `UPDATE Inventory SET ItemCount = ItemCount + ${amount} WHERE ItemId = ${item_id};`;
                    con.query(queryupdate, (err2, rows2, fields2) => {
                        if (err2) {
                            response.status(400).send([{"Error Message": "Failed to update Inventory count... cancelling Employee Purchase!"}]);
                            con.query("ROLLBACK;");

                        } else {

                            // Retrieves to send back data to Frontend
                            let queryselect = `SELECT ItemId AS "Item Id", EmployeeId AS "Employee Id", SellerId AS "Seller Id", Amount, PurchaseDate AS "Purchase Date"
                            FROM EmployeePurchase WHERE PurchaseId = ${purchase_id};`;
                            con.query(queryselect, (err3, rows3, fields3) => {
                                if (err3) {
                                    response.status(400).send([{"Error Message": "Failed to retrieve the Employee Purchase we just created... cancelling Employee Purchase!"}]);
                                    con.query("ROLLBACK;");

                                }
                                response.status(201).send(rows3);
                                con.query("COMMIT;");
                            })

                        }
                    })
                }
            })
            
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
            WHERE PurchaseId = ?;`;
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

        con.query(querystring, [purchase_id], (err, rows, fields) => {
            if (!err) {
                response.status(200).send(rows);
            } else {
                response.status(400).send([{"Error Message" : "Failed to retrieve Employee Purchase(s)."}]);
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
        let order_id;

        if (amount <= 0) {
            response.status(400).send([{"Error Message" : "Please enter an amount greater than 0!"}]);
            return;
        }

        let queryset = "START TRANSACTION;";
        con.query(queryset, (err1, rows1, fields1) => {

            // Validation Checks
            let queryCount = `SELECT * FROM Inventory WHERE ItemId = ${item_id};`;
            con.query(queryCount, (err, rows, fields) => {
                if (err || rows.length == 0) {
                    response.status(400).send([{"Error Message" : `Failed to retrieve Item Count prior to Creating Order. Please ensure Item #${item_id} exists.`}]);
                    con.query("ROLLBACK;");

                } else {
                    let inventoryCount = rows[0].ItemCount;
                    let itemName = rows[0].ItemName;

                    if (inventoryCount < amount) {
                        response.status(400).send([{"Error Message" : `You cannot purchase ${amount} of '${itemName}' (ID: ${item_id}) because there are only ${inventoryCount}.`}]);
                        con.query("ROLLBACK;");

                    } else {

                        // Creation
                        let querystring = `INSERT INTO CustomerOrder(ItemId, EmployeeId, CustomerId, Amount, OrderDate) VALUES(${item_id}, ${employee_id}, ${customer_id}, ${amount}, CURDATE());`;
                        con.query(querystring, (err2, rows2, fields2) => {
                            if (err2) {
                                // Insert Failed
                                // response.status(400).send([{"Error Message": "Failed to create Customer Order. Please ensure that the Item, Employee, and Customer exist."}]);
                                response.status(400).send(err2);
                                con.query("ROLLBACK;");

                            } else {

                                order_id = rows2.insertId;
                                
                                let queryupdate = `UPDATE Inventory SET ItemCount = ItemCount - ${amount} WHERE ItemId = ${item_id};`
                                con.query(queryupdate, (err3, rows3, fields3) => {
                                    if (err3) {
                                        response.status(400).send([{"Error Message": "Failed to update Inventory count... cancelling Customer Order!"}]);
                                        con.query("ROLLBACK;");
                                        
                                    } else {

                                        // Sends back Data via Retrieve
                                        let queryselect = `SELECT ItemId AS "Item Id", EmployeeId AS "Employee Id", CustomerId AS "Customer Id", Amount, OrderDate AS "Order Date"
                                        FROM CustomerOrder WHERE OrderId = ${order_id};`
                                        con.query(queryselect, (err4, rows4, fields4) => {
                                            if (err4) {
                                                response.status(400).send([{"Error Message": "Failed to retrieve the Customer Order we just created... cancelling Customer Order!"}]);
                                                con.query("ROLLBACK;");

                                            } else {
                                                response.status(201).send(rows4);
                                                con.query("COMMIT;");
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
        })
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
            WHERE OrderId = ?;`;
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

        con.query(querystring, [order_id], (err, rows, fields) => {
            if (!err) {
                response.status(200).send(rows);
            } else {
                response.status(400).send([{"Error Message" : "Failed to retrieve Customer Order(s)."}]);
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

        if (amount <= 0) {
            response.status(400).send([{"Error Message" : "Please enter an amount greater than 0!"}]);
            return;
        }

        let queryset = "START TRANSACTION;";
        con.query(queryset, (err1, rows1, fields1) => {

            // Validation Checks
            let queryCount = `SELECT * FROM Inventory WHERE ItemId = ${item_id};`;
            con.query(queryCount, (err, rows, fields) => {
                if (err || rows.length == 0) {
                    response.status(400).send([{"Error Message" : `Failed to retrieve Item Count prior to Creating Refund. Please ensure Item #${item_id} exists.`}]);
                    con.query("ROLLBACK;");

                } else {
                    // let inventoryCount = rows[0].ItemCount;
                    // let itemName = rows[0].ItemName;

                    // if (inventoryCount < amount) {
                    //     response.status(400).send([{"Error Message" : `You cannot purchase ${amount} of '${itemName}' (ID: ${item_id}) because there are only ${inventoryCount}.`}]);
                    //     con.query("ROLLBACK;");

                    // } else {

                    //     // Creation
                    //     let querystring = `INSERT INTO CustomerOrder(ItemId, EmployeeId, CustomerId, Amount, OrderDate) VALUES(${item_id}, ${employee_id}, ${customer_id}, ${amount}, CURDATE());`;
                    //     con.query(querystring, (err2, rows2, fields2) => {
                    //         if (err2) {
                    //             // Insert Failed
                    //             // response.status(400).send([{"Error Message": "Failed to create Customer Order. Please ensure that the Item, Employee, and Customer exist."}]);
                    //             response.status(400).send(err2);
                    //             con.query("ROLLBACK;");

                    //         } else {

                    //             order_id = rows2.insertId;
                                
                    //             let queryupdate = `UPDATE Inventory SET ItemCount = ItemCount - ${amount} WHERE ItemId = ${item_id};`
                    //             con.query(queryupdate, (err3, rows3, fields3) => {
                    //                 if (err3) {
                    //                     response.status(400).send([{"Error Message": "Failed to update Inventory count... cancelling Customer Order!"}]);
                    //                     con.query("ROLLBACK;");
                                        
                    //                 } else {

                    //                     // Sends back Data via Retrieve
                    //                     let queryselect = `SELECT ItemId AS "Item Id", EmployeeId AS "Employee Id", CustomerId AS "Customer Id", Amount, OrderDate AS "Order Date"
                    //                     FROM CustomerOrder WHERE OrderId = ${order_id};`
                    //                     con.query(queryselect, (err4, rows4, fields4) => {
                    //                         if (err4) {
                    //                             response.status(400).send([{"Error Message": "Failed to retrieve the Customer Order we just created... cancelling Customer Order!"}]);
                    //                             con.query("ROLLBACK;");

                    //                         } else {
                    //                             response.status(201).send(rows4);
                    //                             con.query("COMMIT;");
                    //                         }
                    //                     })
                    //                 }
                    //             })
                    //         }
                    //     })
                    // }
                }
            })
        })

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
            WHERE RefundId = ?;`;
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

        con.query(querystring, [refund_id], (err, rows, fields) => {
            if (!err) {
                response.status(200).send(rows);
            } else {
                response.status(400).send([{"Error Message" : "Failed to retrieve Customer Refund(s)."}]);
            }
        })

    })
});
