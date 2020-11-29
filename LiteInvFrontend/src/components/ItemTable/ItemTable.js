import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button"
import Edit from "@material-ui/icons/Edit"
import Delete from "@material-ui/icons/Delete"
import Input from "components/CustomInput/CustomInput.js";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useHistory } from "react-router";
import axios from "axios"

// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const history = useHistory()
  const { tableHeaderColor, retrieveUrl, deleteUrl, updateUrl } = props;

  const [data, setData] = useState([{[`Item Id`]: "Loading..."}]);
  const [id, setId] = useState(-1);
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fectchSellerData() {
      let result = await axios(retrieveUrl);
      setData(result.data);
    };
    fectchSellerData();
  }, [retrieveUrl]);

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
          <TableRow className={classes.tableHeadRow}>
          <TableCell className={classes.tableCell}>
              <b>Item Id</b>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <b>Item Name</b>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <b>Item Count</b>
            </TableCell>
            <TableCell className={classes.tableCell} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                <TableCell className={classes.tableCell}>
                  {prop[`Item Id`]}
                </TableCell>
                <TableCell className={classes.tableCell}>
                {prop[`Item Name`]}
                </TableCell>
                <TableCell className={classes.tableCell}>
                {prop[`Item Count`]}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <Button
                    className={classes.Button}
                    onClick={() => {
                      setId(prop[`Item Id`]);
                      setName(prop[`Item Name`]);
                      setOpen(true);
                    }}
                  >
                    <Edit />
                  </Button>
                  <Button
                    className={classes.Button}
                    onClick={async () => {
                      let toDelete = window.confirm(`Do you want to delete ${prop[`Item Name`]} (Id: ${prop[`Item Id`]})?`)
                      if (toDelete) {
                        try {
                          let result = await axios(deleteUrl, {
                            params: {
                              item_id: prop[`Item Id`]
                            }
                          });
                          if (result.status === 200) {
                            alert(`${prop[`Item Name`]} (Id: ${prop[`Item Id`]}) is successfully deleted`);
                            history.go(0);
                          }
                        } catch (error) {
                          alert(`${error.response.data[0]["Error Message"]}`)
                        }
                      }
                    }}
                  >
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {name} (Id: {id})
          </DialogContentText>
          <Input
            labelText={`New Item Name`}
            inputProps = {{
              "value": newName,
              "onChange": e => setNewName(e.target.value)
            }}
            formControlProps={{
              fullWidth: true
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
          onClick={async () => {
            if (!(newName)) {
              alert("Please input item name");
              return;
            }
            try {
              let result = await axios(updateUrl, {
                params: {
                  item_id: id,
                  item_name: newName
                }
              });
              if (result.status === 200) {
                alert(`${name} (Id: ${id}) is succesfully updated`)
                history.go(0);
              } 
            } catch (error) {
              alert(`${error.response.data[0]["Error Message"]}`)
            }
          }}
          color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};
