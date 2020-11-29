/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// core components/views for Admin layout
import People from "views/People/People.js";
import Inventory from "views/Inventory/Inventory.js";
import Transaction from "views/Transaction/Transaction.js";

const dashboardRoutes = [
  {
    path: "/people",
    name: "People",
    icon: "person",
    component: People
  },
  {
    path: "/inventory",
    name: "Inventory",
    icon: "widgets",
    component: Inventory
  },
  {
    path: "/transaction",
    name: "Transactions",
    icon: "receipt_long",
    component: Transaction
  }
];

export default dashboardRoutes;
