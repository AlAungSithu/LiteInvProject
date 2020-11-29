import React, { useEffect, useState } from "react"
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Input from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button";
import Select from "components/CustomSelect/CustomSelect.js";

import axios from "axios";
import { useHistory } from "react-router";

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

export default function CustomerOrder() {
    const classes = useStyles();
    const history = useHistory()

    const headerList = ["Order Id", "Order Date", "Item Id", "Item Name", "Employee Id", "Employee Name", "Customer Id", "Customer Name", "Amount"]
    const retrieveTransactionUrl = "https://us-central1-liteinvbackend.cloudfunctions.net/transaction-retrieve_order"
    const createTransactionUrl = "https://us-central1-liteinvbackend.cloudfunctions.net/transaction-create_order"
    const retrieveItemUrl = "https://us-central1-liteinvbackend.cloudfunctions.net/inventory-retrieve_item"
    const retrieveEmployeeUrl = "https://us-central1-liteinvbackend.cloudfunctions.net/retrieve_employee"
    const retrieveCustomerUrl = "https://us-central1-liteinvbackend.cloudfunctions.net/retrieve_customer"
    
    const [data, setData] = useState([{"Purchase Id": "Loading..."}])
    const [itemData, setItemData] = useState([{"Item Id": "Loading...", "Item Name": "", "Item Count": ""}])
    const [employeeData, setEmployeeData] = useState([{"Employee Id": "Loading...", "Employee Name": "", "Employee Email": ""}])
    const [customerData, setCustomerData] = useState([{"Customer Id": "Loading...", "Customer Name": "", "Customer Email": ""}])
    
    const [itemId, setItemId] = useState()
    const [employeeId, setEmployeeId] = useState()
    const [customerId, setCustomerId] = useState()
    const [amount, setAmount] = useState()

    useEffect(() => {
        async function fectchData() {
            let result = await axios(retrieveTransactionUrl);
            setData(result.data);

            result = await axios(retrieveItemUrl)
            setItemData(result.data)

            result = await axios(retrieveEmployeeUrl)
            setEmployeeData(result.data)

            result = await axios(retrieveCustomerUrl)
            setCustomerData(result.data)
        };
        fectchData();
    }, []);

    return (
        <Card>
            <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}><b>Customer Order</b></h4>
                <p className={classes.cardCategoryWhite}> Customer purchases item from stock </p>
            </CardHeader>

            <CardBody>
            <Table
                tableHeaderColor="primary"
                tableHead={headerList}
                tableData={data.map((item, key) => {
                    return headerList.map((header, key2) => {
                        return item[header]
                    })
                })}
            />

        <form
            onSubmit={async (e) => {
                e.preventDefault();
                if (!(itemId && employeeId && customerId && amount)) {
                    alert("Please input customer order's information");
                    return;
                }
                try {
                    let result = await axios(createTransactionUrl, {
                        params: {
                            item_id: itemId,
                            employee_id: employeeId,
                            customer_id: customerId,
                            amount: amount 
                        }
                    });
                    if (result.status === 201) {
                        alert(`Customer Order is successfully created`);
                        history.go(0)
                    }
                } catch (error) {
                    alert(`${error.response.data[0]["Error Message"]}`)
                }
            }}
        >
            <Select
                labelText={`Item`}
                inputProps = {{
                    "value": itemId,
                    "onChange": e => setItemId(e.target.value)
                }}
                formControlProps={{
                    fullWidth: true
                }}
                items = {itemData.map((item, key) => {
                    return {
                        id: key,
                        value: item["Item Id"],
                        label: `${item['Item Id']}: ${item['Item Name']} (${item['Item Count']} in stock)`
                    }
                })}
            />

            <Select
                labelText={`Employee`}
                inputProps = {{
                    "value": employeeId,
                    "onChange": e => setEmployeeId(e.target.value)
                }}
                formControlProps={{
                    fullWidth: true
                }}
                items = {employeeData.map((employee, key) => {
                    return {
                        id: key,
                        value: employee["Employee Id"],
                        label: `${employee['Employee Id']}: ${employee['Employee Name']} (${employee['Employee Email']})`
                    }
                })}
            />

            <Select
                labelText={`Customer`}
                inputProps = {{
                    "value": customerId,
                    "onChange": e => setCustomerId(e.target.value)
                }}
                formControlProps={{
                    fullWidth: true
                }}
                items = {customerData.map((customer, key) => {
                    return {
                        id: key,
                        value: customer["Customer Id"],
                        label: `${customer['Customer Id']}: ${customer['Customer Name']} (${customer['Customer Email']})`
                    }
                })}
            />
            
            <Input
                labelText={`Item Amount`}
                inputProps = {{
                    "value": amount,
                    "onChange": e => setAmount(e.target.value)
                }}
                formControlProps={{
                    fullWidth: true
                }}
            />

            <Button
                color="warning"
                type="submit"
            >
                Create Customer Order
            </Button>
            </form>
            </CardBody>
        </Card>
    );
}
