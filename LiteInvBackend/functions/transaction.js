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
        let queryset = "SET TRANSACTION ISOLATION LEVEL READ COMMITTED; START TRANSACTION;";
        con.query(queryset, (err1, rows1, fields1) => {
            
            if (err1) {
                response.status(400).send([{"Error Message": "Failed to access database."}]);
                return;
            }

            // Create Item
            let querystring = `INSERT INTO EmployeePurchase(ItemId, EmployeeId, SellerId, Amount, PurchaseDate) VALUES(?, ?, ?, ?, NOW());`;
            con.query(querystring, [item_id, employee_id, seller_id, amount], (err1, rows1, fields1) => {
                if (err1) {
                    response.status(400).send([{"Error Message": "Failed to create Employee Purchase. Please ensure that the Item, Seller, and Employee exist."}]);
                    con.query("ROLLBACK;");

                } else {

                    // Updates ItemCount in Inventory
                    purchase_id = rows1.insertId;
                    let queryupdate = `UPDATE Inventory SET ItemCount = ItemCount + ? WHERE ItemId = ?;`;
                    con.query(queryupdate, [amount, item_id], (err2, rows2, fields2) => {
                        if (err2) {
                            response.status(400).send([{"Error Message": "Failed to update Inventory count... cancelling Employee Purchase!"}]);
                            con.query("ROLLBACK;");

                        } else {

                            // Retrieves to send back data to Frontend
                            let queryselect = `SELECT PurchaseId AS "Purchase Id", ItemId AS "Item Id", EmployeeId AS "Employee Id", SellerId AS "Seller Id", Amount, PurchaseDate AS "Purchase Date"
                            FROM EmployeePurchase WHERE PurchaseId = ?;`;
                            con.query(queryselect, [purchase_id], (err3, rows3, fields3) => {
                                if (err3) {
                                    response.status(400).send([{"Error Message": "Failed to retrieve the Employee Purchase we just created... cancelling Employee Purchase!"}]);
                                    con.query("ROLLBACK;");

                                }
                                let wholeDate = rows3[0]['Purchase Date'].toLocaleString().substring(0, 10);
                                rows3[0]['Purchase Date'] = wholeDate;
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
            ON ep.SellerId = s.SellerId
            ORDER BY ep.PurchaseId;`;
        }

        con.query(querystring, [purchase_id], (err, rows, fields) => {
            if (!err) {
                let i = 0;
                while (i < rows.length) {
                    let wholeDate = rows[i]['Purchase Date'].toLocaleString().substring(0, 10);
                    rows[i]['Purchase Date'] = wholeDate;
                    i++;
                }
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

        let queryset = "SET TRANSACTION ISOLATION LEVEL REPEATABLE READ; START TRANSACTION;";
        con.query(queryset, (err1, rows1, fields1) => {

            if (err1) {
                response.status(400).send([{"Error Message": "Failed to access database."}]);
                return;
            }

            // Validation Checks
            let queryCount = `SELECT * FROM Inventory WHERE ItemId = ?;`;
            con.query(queryCount, [item_id], (err, rows, fields) => {
                if (err || rows.length == 0) {
                    response.status(400).send([{"Error Message" : `Failed to retrieve Item Count prior to Creating Order. Please ensure Item #${item_id} exists.`}]);
                    con.query("ROLLBACK;");

                } else {
                    let inventoryCount = rows[0].ItemCount;
                    let itemName = rows[0].ItemName;

                    if (inventoryCount < amount) {
                        response.status(400).send([{"Error Message" : `The Customer cannot purchase ${amount} of '${itemName}' (ID: ${item_id}) because there are only ${inventoryCount}.`}]);
                        con.query("ROLLBACK;");

                    } else {

                        // Creation
                        let querystring = `INSERT INTO CustomerOrder(ItemId, EmployeeId, CustomerId, Amount, OrderDate) VALUES(?, ?, ?, ?, NOW());`;
                        con.query(querystring, [item_id, employee_id, customer_id, amount], (err2, rows2, fields2) => {
                            if (err2) {
                                // Insert Failed
                                response.status(400).send([{"Error Message": "Failed to create Customer Order. Please ensure that the Item, Employee, and Customer exist."}]);
                                con.query("ROLLBACK;");

                            } else {

                                order_id = rows2.insertId;
                                
                                let queryupdate = `UPDATE Inventory SET ItemCount = ItemCount - ? WHERE ItemId = ?;`
                                con.query(queryupdate, [amount, item_id], (err3, rows3, fields3) => {
                                    if (err3) {
                                        response.status(400).send([{"Error Message": "Failed to update Inventory count... cancelling Customer Order!"}]);
                                        con.query("ROLLBACK;");
                                        
                                    } else {

                                        // Sends back Data via Retrieve
                                        let queryselect = `SELECT OrderId AS "Order Id", ItemId AS "Item Id", EmployeeId AS "Employee Id", CustomerId AS "Customer Id", Amount, OrderDate AS "Order Date"
                                        FROM CustomerOrder WHERE OrderId = ?;`
                                        con.query(queryselect, [order_id], (err4, rows4, fields4) => {
                                            if (err4) {
                                                response.status(400).send([{"Error Message": "Failed to retrieve the Customer Order we just created... cancelling Customer Order!"}]);
                                                con.query("ROLLBACK;");

                                            } else {
                                                let wholeDate = rows4[0]['Order Date'].toLocaleString().substring(0, 10);
                                                rows4[0]['Order Date'] = wholeDate;
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
            ON o.CustomerId = c.CustomerId
            ORDER BY o.OrderId;`;
        }

        con.query(querystring, [order_id], (err, rows, fields) => {
            if (!err) {
                let i = 0;
                while (i < rows.length) {
                    let wholeDate = rows[i]['Order Date'].toLocaleString().substring(0, 10);
                    rows[i]['Order Date'] = wholeDate;
                    i++;
                }
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

        let queryset = "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; START TRANSACTION;";
        con.query(queryset, (err1, rows1, fields1) => {

            if (err1) {
                response.status(400).send([{"Error Message": "Failed to access database."}]);
                return;
            }

            // Validation Checks
            let queryCount = `SELECT * FROM (
                SELECT co.CustomerId, co.ItemId, SUM(co.Amount) AS TotalPurchasedPrev
                FROM CustomerOrder co
                GROUP BY co.CustomerId, co.ItemId
                HAVING co.CustomerId = ? AND co.ItemId = ?) t1
                LEFT OUTER JOIN
                (SELECT cr.CustomerId, cr.ItemId, SUM(cr.Amount) AS TotalRefundPrev
                FROM CustomerRefund cr
                GROUP BY cr.CustomerId, cr.ItemId
                HAVING cr.CustomerId = ? AND cr.ItemId = ?) t2
                ON t1.CustomerId = t2.CustomerId;`;
            con.query(queryCount, [customer_id, item_id, customer_id, item_id], (err, rows, fields) => {
                
                if (err) {
                    // Failed to Retreive
                    response.status(400).send([{"Error Message" : `Failed to retrieve previous Purchase and Refund counts prior to Creating Refund.`}]);
                    con.query("ROLLBACK;");

                } else if (rows.length == 0) {
                    // Retreived but no rows returned
                    response.status(400).send([{"Error Message" : `Please ensure that the Customer and Item exist and that the Customer has purchased the Item.`}]);
                    con.query("ROLLBACK;");

                } else {
                    
                    let prevPurchaseCount = rows[0].TotalPurchasedPrev;
                    let prevRefundCount = rows[0].TotalRefundPrev;
                    if (prevRefundCount == null) {
                        prevRefundCount = 0;
                    }
                    let refundableAmount = prevPurchaseCount - prevRefundCount;

                    if ((refundableAmount) < amount) {
                        response.status(400).send([{"Error Message" : `The Customer can only receive a refund on ${refundableAmount} of Item: '${item_id}', but the refund amount is ${amount}.`}]);
                        con.query("ROLLBACK;");
                    } else {

                        // Creation
                        let querystring = `INSERT INTO CustomerRefund(ItemId, EmployeeId, CustomerId, Amount, RefundDate) VALUES(?, ?, ?, ?, NOW());`;
                        con.query(querystring, [item_id, employee_id, customer_id, amount], (err2, rows2, fields2) => {
                            if (err2) {
                                // Insert Failed
                                response.status(400).send([{"Error Message": "Failed to create Customer Refund. Please ensure that the Employee exists."}]);
                                con.query("ROLLBACK;");

                            } else {

                                refund_id = rows2.insertId;
                                
                                let queryupdate = `UPDATE Inventory SET ItemCount = ItemCount + ? WHERE ItemId = ?;`
                                con.query(queryupdate, [amount, item_id], (err3, rows3, fields3) => {
                                    if (err3) {
                                        response.status(400).send([{"Error Message": "Failed to update Inventory count... cancelling Customer Refund!"}]);
                                        con.query("ROLLBACK;");
                                        
                                    } else {

                                        // Sends back Data via Retrieve
                                        let queryselect = `SELECT RefundId AS "Refund Id", ItemId AS "Item Id", EmployeeId AS "Employee Id", CustomerId AS "Customer Id", Amount, RefundDate AS "Refund Date"
                                        FROM CustomerRefund WHERE RefundId = ?;`
                                        con.query(queryselect, [refund_id], (err4, rows4, fields4) => {
                                            if (err4) {
                                                response.status(400).send([{"Error Message": "Failed to retrieve the Customer Refund we just created... cancelling Customer Refund!"}]);
                                                con.query("ROLLBACK;");

                                            } else {
                                                let wholeDate = rows4[0]['Refund Date'].toLocaleString().substring(0, 10);
                                                rows4[0]['Refund Date'] = wholeDate;
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
            ON r.CustomerId = c.CustomerId
            ORDER BY r.RefundId;;`;
        }

        con.query(querystring, [refund_id], (err, rows, fields) => {
            if (!err) {
                let i = 0;
                while (i < rows.length) {
                    let wholeDate = rows[i]['Refund Date'].toLocaleString().substring(0, 10);
                    rows[i]['Refund Date'] = wholeDate;
                    i++;
                }
                response.status(200).send(rows);
            } else {
                response.status(400).send([{"Error Message" : "Failed to retrieve Customer Refund(s)."}]);
            }
        })

    })
});
