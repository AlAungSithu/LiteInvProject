const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const con = require('./mysql')


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



// SELLER FUNCTIONS
exports.create_seller = functions.https.onRequest(async (request, response) => {
    /* FORMAT
        "Success": true/false,
        "SellerId": inserted id     OR      -1 on Success == false,
        "SellerName": "name sent to backend",
        "SellerEmail": "email sent to backend"
    */
    let name = request.body.seller_name;
    let email = request.body.seller_email;
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
});

exports.retrieve_seller = functions.https.onRequest(async (request, response) => {
    /* FORMAT
        ON SUCCESS - person with that id found
            "SellerId": retrieved-id,
            "SellerName": "retrieved-name",
            "SellerEmail": "retrieved-email"
        ON FAILURE - no person with that id found
            Blank
    */
    let id = request.body.seller_id;
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
});


exports.update_seller = functions.https.onRequest(async (request, response) => {
    /* FORMAT
        "Success": true/false
    */
    let id = request.body.seller_id;
    let new_name = request.body.seller_name;
    let new_email = request.body.seller_email;
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
});


exports.delete_seller = functions.https.onRequest(async (request, response) => {
    /* FORMAT
        "Success": true/false
    */
    let id = request.body.seller_id;
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
    })
});


// EMPLOYEE FUNCTIONS


// CUSTOMER FUNCTIONS
