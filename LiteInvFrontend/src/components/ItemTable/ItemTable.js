import React from "react";
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
import Delete from "@material-ui/icons/Delete";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor } = props;
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>
                Item Id
              </TableCell>
              <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>
                Name
              </TableCell>
              <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>
                Count
              </TableCell>
              <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>
              </TableCell>
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                <TableCell className={classes.tableCell}>
                  {prop.id}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {prop.name}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {prop.count}
                </TableCell>
                <TableCell>
                  <Button>
                    <Edit />
                  </Button>
                  <Button>
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
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
