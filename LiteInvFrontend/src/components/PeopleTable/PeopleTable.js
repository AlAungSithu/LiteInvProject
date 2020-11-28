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
  const { type, summaries, tableHeaderColor, retrieveUrl, deleteUrl, updateUrl } = props;

  const [data, setData] = useState([{[`${type} Id`]: "Loading..."}]);
  const [id, setId] = useState(-1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
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
              <b>{`${type} Id`}</b>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <b>{`${type} Name`}</b>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <b>{`${type} Email`}</b>
            </TableCell>
            {summaries.map((summary, key) => {
              return (<TableCell className={classes.tableCell}>
                <b>{summary}</b>
              </TableCell>)
            })}
            <TableCell className={classes.tableCell} />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                <TableCell className={classes.tableCell}>
                  {prop[`${type} Id`]}
                </TableCell>
                <TableCell className={classes.tableCell}>
                {prop[`${type} Name`]}
                </TableCell>
                <TableCell className={classes.tableCell}>
                {prop[`${type} Email`]}
                </TableCell>
                {summaries.map((summary, key) => {
                  return (<TableCell className={classes.tableCell}>
                    <b>{prop[summary]}</b>
                  </TableCell>)
                })}
                <TableCell className={classes.tableCell}>
                  <Button
                    className={classes.Button}
                    onClick={() => {
                      setId(prop[`${type} Id`]);
                      setName(prop[`${type} Name`]);
                      setEmail(prop[`${type} Email`]);
                      setOpen(true);
                    }}
                  >
                    <Edit />
                  </Button>
                  <Button
                    className={classes.Button}
                    onClick={async () => {
                      let toDelete = window.confirm(`Do you want to delete ${prop[`${type} Name`]} (Id: ${prop[`${type} Id`]}, Email: ${prop[`${type} Email`]})?`)
                      if (toDelete) {
                        try {
                          let result = await axios(deleteUrl, {
                            params: {
                              [`${type.toLowerCase()}_id`]: prop[`${type} Id`]
                            }
                          });
                          if (result.status === 200) {
                            alert(`${type} ${prop[`${type} Name`]} (Id: ${prop[`${type} Id`]}, Email: ${prop[`${type} Email`]}) is successfully deleted`);
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
            {type} {name} (Id: {id}, Email: {email})
          </DialogContentText>
          <Input
            labelText={`New ${type} Name`}
            inputProps = {{
              "value": newName,
              "onChange": e => setNewName(e.target.value)
            }}
            formControlProps={{
              fullWidth: true
            }}
          />
          <Input
            labelText={`New ${type} Email`}
            inputProps = {{
              "value": newEmail,
              "onChange": e => setNewEmail(e.target.value)
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
            if (!(newName && newEmail)) {
              alert("Please input name and email");
              return;
            }
            try {
              let result = await axios(updateUrl, {
                params: {
                  [`${type.toLowerCase()}_id`]: id,
                  [`${type.toLowerCase()}_name`]: newName,
                  [`${type.toLowerCase()}_email`]: newEmail,
                }
              });
              if (result.status === 200) {
                alert(`${type} ${name} (Id: ${id}, Email: ${email}) is succesfully updated`)
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
