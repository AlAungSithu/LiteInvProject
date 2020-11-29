import React, { useEffect, useState } from "react"
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles"
// core components
import Table from "components/Table/Table.js"
import Card from "components/Card/Card.js"
import CardHeader from "components/Card/CardHeader.js"
import CardBody from "components/Card/CardBody.js"
import Select from "components/CustomSelect/CustomSelect.js";
import axios from "axios"

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

export default function StockHistory(props) {
    const { retrieveUrl } = props
    const classes = useStyles();
    const headerList = ["Date", "Transaction Type", "Item Id", "Item Name", "Amount"]
    const [data, setData] = useState([{"Date": "Loading..."}])
    const dateList = [{"key": 0, "label": "Show All", "value": -1},
                      {"key": 1, "label": "Past 1 day", "value": 1},
                      {"key": 2, "label": "Past 7 days", "value": 7},
                      {"key": 3, "label": "Past 15 days", "value": 15},
                      {"key": 4, "label": "Past 30 days", "value": 30},
                      {"key": 5, "label": "Past 365 days", "value": 365},]
    const [currentOffset, setCurrentOffset] = useState(-1)

    useEffect(() => {
        async function fectchSellerData() {
            let date = new Date()
            date.setDate(date.getDate() - currentOffset)
            setData([{"Date": "Loading..."}])
            let result = await axios(retrieveUrl, {
                params: {
                  start_date: currentOffset === -1 ? "" : `${date.getFullYear()}:${date.getMonth() + 1}:${date.getDate()}`
                }
            });
            setData(result.data);
        };
        fectchSellerData();
    }, [currentOffset, retrieveUrl]);

    return (
        <Card plain>
            <CardHeader plain color="primary">
                <h4 className={classes.cardTitleWhite}>
                <b>Stock History</b>
                </h4>
                <p className={classes.cardCategoryWhite}> Compilation of all transactions </p>
            </CardHeader>
            <CardBody>
                <form>
                <Select
                    labelText={"Filter Date"}
                    inputProps = {{
                        "value": currentOffset,
                        "onChange": e => {
                            setCurrentOffset(e.target.value)
                        }
                    }}
                    formControlProps={{
                    fullWidth: true
                    }}
                    items = {dateList}
                />
                </form>
                <Table
                    tableHeaderColor="primary"
                    tableHead={headerList}
                    tableData={data.map((item, key) => {
                        return headerList.map((header, key2) => {
                            return item[header]
                        })
                    })}
                />
            </CardBody>
        </Card>
    );
}
