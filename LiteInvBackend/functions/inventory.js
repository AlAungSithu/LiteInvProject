const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const con = require('./mysql')

// ITEM OPERATIONS
exports.create_item = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
        let name = request.query.item_name;
        res = [];

        con.query(`INSERT INTO Inventory (ItemName) VALUES ("${name}");`, (err, rows, fields) => {
            if (!err) {
                res.push({ ItemId: rows.insertId, ItemName: name });
                response.status(201).send(res);
            } else {
                response.status(400).send(err);
            }
        })
    })
});

exports.retrieve_item = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        let id = request.query.item_id;
        
        // Retrieve ID
        if (id) {
            con.query(`SELECT * FROM Inventory WHERE ItemId = ${id}`, (err, rows, fields) => {
                if (!err)
                    response.status(200).send(rows);
                else
                    response.status(400).send(err);
            })

        // Retrieve All
        } else {
            con.query(`SELECT * FROM Inventory`, (err, rows, fields) => {
                if (!err)
                    response.status(200).send(rows);
                else
                    response.status(400).send(err);
            })
        }

    })
});

exports.update_item = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {

        let id = request.query.item_id;
        let new_name = request.query.new_item_name;
        res = [];
 
        sql = `UPDATE Inventory SET ItemName = "${new_name}" WHERE ItemId = "${id}";`

        con.query(sql, (err, rows, fields) => {
            if (!err) {
                //res.push({ ItemId: id, ItemName: new_name })
                response.sendStatus(200);
            } else {
                response.status(400).send(err);
            }
        })

    })
});

exports.delete_item = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
        let id = request.query.item_id;

        con.query(`DELETE FROM Inventory WHERE ItemId = ${id}`, (err, rows, fields) => {
            if (!err) {
                response.sendStatus(200);
            } else {
                response.status(400).send(err);
            }
        })
    })
});