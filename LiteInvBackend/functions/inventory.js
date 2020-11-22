const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const con = require('./mysql')

// ITEM OPERATIONS
exports.create_item = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
        let name = request.query.item_name;
        res = [];

        con.query(`INSERT INTO Inventory (ItemName) VALUES (?);`, [name], (err, rows, fields) => {
            if (!err) {
                res.push({ "Item Id": rows.insertId, "Item Name": name });
                response.status(201).send(res);
            } else {
                response.status(400).send([{"Error Message" : "Failed to create Item."}]);
            }
        })
    })
});

exports.retrieve_item = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        let id = request.query.item_id;
        let querystring = ``;

        // Retrieve ID
        if (id) {
            querystring = `SELECT ItemId AS "Item Id", ItemName AS "Item Name", ItemCount AS "Item Count" FROM Inventory WHERE ItemId = ?;`
        // Retrieve All
        } else {
            querystring = `SELECT ItemId AS "Item Id", ItemName AS "Item Name", ItemCount AS "Item Count" FROM Inventory;`
        }
        con.query(querystring, [id], (err, rows, fields) => {
            if (!err) {
                response.status(200).send(rows);
            } else {
                response.status(400).send([{"Error Message" : "Failed to retrieve Item(s)."}]);
            }
        })

    })
});

exports.update_item = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        let id = request.query.item_id;
        let new_name = request.query.item_name;
        res = [];
 
        sql = `UPDATE Inventory SET ItemName = ? WHERE ItemId = ?;`

        con.query(sql, [new_name, id], (err, rows, fields) => {
            if (!err) {
                //res.push({ ItemId: id, ItemName: new_name })
                response.sendStatus(200);
            } else {
                response.status(400).send([{"Error Message" : "Failed to update Item."}]);
            }
        })

    })
});

exports.delete_item = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
        let id = request.query.item_id;

        if (!id) {
            response.status(400).send([{"Error Message" : `Please enter an Item Id!`}]);
            return;
        }

        con.query(`DELETE FROM Inventory WHERE ItemId = ?`, [id], (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send([{"Error Message" : `Cannot delete Item ${id} because there are Transactions that include this item.`}]);
            }
        })
    })
});

// STOCK HISTORY OPERATIONS
exports.retrieve_history = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
        let start_date = request.query.start_date;
        let end_date = request.query.end_date;

        // No Start Date, Set to Min Date
        if (!start_date) {
            start_date = "0000-00-00"
        }
        // No End Date, Set to Max Date
        if (!end_date) {
            end_date = "9999-12-31"
        }

        querystring = `SELECT s.Date AS "Transaction Date", s.Type AS "Transaction Type", s.ItemId AS "Item Id", i.ItemName AS "Item Name", s.Amount
            FROM StockHistory s JOIN Inventory i
            ON s.ItemId = i.ItemId
            WHERE s.Date >= ? AND s.date <= ?;`;

        con.query(querystring, [start_date, end_date], (err, rows, fields) => {
            if (!err) {
                response.status(200).send(rows);
            } else {
                response.status(400).send([{"Error Message" : "Failed to retrieve Stock History."}]);
            }
        })

    })
});
