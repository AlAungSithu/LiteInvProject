import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import TransactionsForm from "components/TransactionsForm/TransactionsForm";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

export default function TableList() {
  const classes = useStyles();
  return (
    <CustomTabs
      title=""
      headerColor="rose"
      tabs={[
        {
          tabName: "Employee Purchases",
          tabContent: (
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}><b>Employee Purchase</b></h4>
                <p className={classes.cardCategoryWhite}>
                  Buy items from seller to fill the stock
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Purchase Id", "Item Id", "Item Name", "Employee Id", "Employee Name", "Seller Id", "Seller Name", "Amount", "Purchase Date"]}
                  tableData={[
                    [1, 1, "Paper", 1, "Adam Thomas", 2, "Mary Rock", 25, "09/30/2020"]
                  ]}
                />
                <TransactionsForm
                  type = "Employee Purchase"
                />       
              </CardBody>
            </Card>
          )
        },
        {
          tabName: "Customer Orders",
          tabContent: (
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}><b>Customer Order</b></h4>
                <p className={classes.cardCategoryWhite}>
                  Customer purchases item from stock
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Order Id", "Item Id", "Item Name", "Employee Id", "Employee Name", "Customer Id", "Customer Name", "Amount", "Purchase Date"]}
                  tableData={[
                    [1, 1, "Paper", 1, "Adam Thomas", 2, "Mary Rock", 25, "09/30/2020"]
                  ]}
                />
              </CardBody>
            </Card>
          )
        },
        {
          tabName: "Customer Refunds",
          tabContent: (
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}><b>Customer Refund</b></h4>
                <p className={classes.cardCategoryWhite}>
                  Customer refunds back to stock
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Refund Id", "Item Id", "Item Name", "Employee Id", "Employee Name", "Customer Id", "Customer Name", "Amount", "Purchase Date"]}
                  tableData={[
                    [1, 1, "Paper", 1, "Adam Thomas", 2, "Mary Rock", 25, "09/30/2020"]
                  ]}
                />
              </CardBody>
            </Card>
          )
        }
      ]}
    />
  );
}
