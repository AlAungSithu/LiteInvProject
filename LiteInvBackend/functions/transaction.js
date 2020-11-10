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

        // Validation Checks


        // Creation
        
    })
});

exports.retrieve_purchase = functions.https.onRequest(async (request, response) => {
    cors(request, response, () => {
        let purchase_id = request.query.purchase_id;
        
        // Retrieve ID
        if (purchase_id) {
            
        // Retrieve All
        } else {
            
        }

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
        
        // Retrieve ID
        if (order_id) {
            
        // Retrieve All
        } else {
            
        }

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
        
        // Retrieve ID
        if (refund_id) {
            
        // Retrieve All
        } else {
            
        }

    })
});
