import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import PeopleTable from "components/PeopleTable/PeopleTable.js";
import PeopleForm from "components/PeopleForm/PeopleForm";

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

export default function PeopleCard(props) {
  const classes = useStyles();
  const { title, type, createUrl, retrieveUrl, updateUrl, deleteUrl} = props;
  return (
    <Card>
      <CardHeader color="info">
        <h4 className={classes.cardTitleWhite}><b>{type}s</b></h4>
        <p className={classes.cardCategoryWhite}>
          {title}
        </p>
      </CardHeader>
      <CardBody>
        <PeopleTable
          type={type}
          tableHeaderColor="primary"
          retrieveUrl={retrieveUrl}
          updateUrl={updateUrl}
          deleteUrl={deleteUrl}
        />
        <PeopleForm
          type={type}
          url={createUrl}
        />
      </CardBody>
    </Card>
  );
}
