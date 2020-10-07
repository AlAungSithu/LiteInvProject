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

// data.variable

exports.test = functions.https.onRequest(async (request, response) => {
    response.send("Hello from Firebase!")
});

// SELLER FUNCTIONS
exports.create_seller = functions.https.onRequest(async (request, response) => {

    // const seller_name = request.query.seller_name;
    // const seller_email = request.query.seller_email;
    // const query = con.query(`INSERT INTO Seller (SellerName, SellerEmail) VALUES ("${seller_name}"", "${seller_email}");`);
    const query = con.query(`INSERT INTO Seller (SellerName, SellerEmail) VALUES ("A22ice", "alice42225329@gmail.com");`);
    console.log(query);
    //response.send(query);
    
});

exports.retrieve_seller = functions.https.onRequest(async (request, response) => {
    const query = con.query(`SELECT * FROM Seller;`);
    i = 0;
    while (i < 1000) i++;
    console.log(query);

    // const seller_id = request.query.seller_id;
    // if (seller_id) {
    //     // ID Passed, Return Specific
    //     const query = con.query(`SELECT * FROM Seller WHERE SellerId = "${seller_id}"`);
    //     response.send(query);
    // } else {
    //     // No ID Passed, Return All
    //     const query = con.query(`SELECT * FROM Seller;`);
    //     response.send(query);
    // }
});

exports.update_seller = functions.https.onRequest(async (request, response) => {
    const seller_id = request.query.seller_id;
    const new_seller_name = request.query.seller_id;
    const new_seller_email = request.query.seller_id;
    if (new_seller_name && new_seller_email) {
        // Update Both Values
        query = con.query(`UPDATE Seller SET SellerName = "${new_seller_name}", SellerEmail = "${new_seller_email}" WHERE SellerId = "${seller_id}";`);
        response.send(query);
    } else if (new_seller_name) {
        // Update Name Only
        query = con.query(`UPDATE Seller SET SellerName = "${new_seller_name}" WHERE SellerId = "${seller_id}";`);
        response.send(query);
    } else if (new_seller_email) {
        // Update Email Only
        query = con.query(`UPDATE Seller SET SellerEmail = "${new_seller_email}" WHERE SellerId = "${seller_id}";`);
        response.send(query);
    } else {
        // No Updates
        query = con.query(`SELECT * FROM Seller WHERE SellerId = "${seller_id})";`)
        response.send(query);
    }
});


// EMPLOYEE FUNCTIONS


// CUSTOMER FUNCTIONS




