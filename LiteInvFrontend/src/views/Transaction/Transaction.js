import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import EmployeePurchase from "components/EmployeePurchase/EmployeePurchase.js";
import CustomerOrder from "components/CustomerOrder/CustomerOrder.js"
import CustomerRefund from "components/CustomerRefund/CustomerRefund.js"

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
          tabContent: <EmployeePurchase />
        },
        {
          tabName: "Customer Orders",
          tabContent: <CustomerOrder />
        },
        {
          tabName: "Customer Refunds",
          tabContent: <CustomerRefund />
        }
      ]}
    />
  );
}
