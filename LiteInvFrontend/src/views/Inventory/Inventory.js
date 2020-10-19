import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import ItemTable from "components/ItemTable/ItemTable.js";
import Table from "components/Table/Table.js"
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Chip from "@material-ui/core/Chip";

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

export default function Inventory() {
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="rose">
            <h4 className={classes.cardTitleWhite}><b>Items</b></h4>
            <p className={classes.cardCategoryWhite}>
              All stuffs in stock
            </p>
          </CardHeader>
          <CardBody>
            <ItemTable
              tableHeaderColor="primary"
              tableHead={["Item Id", "Name", "Count", "Tag"]}
              tableData={[
                {id: 1, name: "Paper", count: 25, tag: [{id: 3, name: "Stationary"}, {id: 1, name: "Non-durable"}]},
                {id: 2, name: "Keyboard", count: 3, tag: [{id: 4, name: "Computer"}, {id: 2, name: "Durable"}]},
                {id: 3, name: "Box", count: 8, tag: [{id: 5, name: "Package"}, {id: 1, name: "Non-durable"}]}
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>
              <b>Tag</b>
            </h4>
            <p className={classes.cardCategoryWhite}>
              Categories of items
            </p>
          </CardHeader>
          <CardBody>
            {["Non-durable", "Durable", "Stationary", "Computer", "Package"].map((prop, key) => {
              return <Chip label={prop} variant="outlined" style={{margin: "5px"}}/>
            })}
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>
              <b>Stock History</b>
            </h4>
            <p className={classes.cardCategoryWhite}>
              Compilation of all transactions
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Transaction Date", "Transaction Type", "Item Id", "Item Name", "Amount"]}
              tableData={[
                ["9/30/2020", "Employee Purchase", "1", "Paper", 25],
                ["9/30/2020", "Customer Order", "1", "Paper", 25],
                ["9/30/2020", "Customer Refund", "1", "Paper", 25]
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
