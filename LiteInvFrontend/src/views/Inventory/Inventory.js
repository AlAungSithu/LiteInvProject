import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles"
// core components
import GridItem from "components/Grid/GridItem.js"
import GridContainer from "components/Grid/GridContainer.js"
import ItemTable from "components/ItemTable/ItemTable.js"
import Card from "components/Card/Card.js"
import CardHeader from "components/Card/CardHeader.js"
import CardBody from "components/Card/CardBody.js"
import ItemsForm from "components/ItemsForm/ItemsForm.js"
import StockHistory from "components/StockHistory/StockHistory.js"

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
              retrieveUrl="https://us-central1-liteinvbackend.cloudfunctions.net/inventory-retrieve_item"
              updateUrl="https://us-central1-liteinvbackend.cloudfunctions.net/inventory-update_item"
              deleteUrl="https://us-central1-liteinvbackend.cloudfunctions.net/inventory-delete_item"
            />
            <ItemsForm
              url="https://us-central1-liteinvbackend.cloudfunctions.net/inventory-create_item"
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <StockHistory
          retrieveUrl="https://us-central1-liteinvbackend.cloudfunctions.net/inventory-retrieve_history"
        />
      </GridItem>
    </GridContainer>
  );
}
