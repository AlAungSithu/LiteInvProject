import React, { useState } from "react";
// @material-ui/core components
import MenuItem from '@material-ui/core/MenuItem';

// core components
import Input from "components/CustomInput/CustomInput.js";
import Select from "components/CustomSelect/CustomSelect.js";
import Button from "components/CustomButtons/Button.js";

import axios from "axios";
import { useHistory } from "react-router";

export default function TransactionsForm(props) {
  const { url, type } = props;
  const history = useHistory();
  const [name, setName] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!(name)) {
          alert("Please input name and email");
          return;
        }
        let result = await axios(url, {
          params: {
            [`${type.toLowerCase()}_name`]: name
          }
        });
        if (result.data[0].Success) {
          alert(`${type} ${result.data[0][`${type}Name`]} (Id: ${result.data[0][`${type}Id`]}, Email: ${result.data[0][`${type}Email`]}) is successfully created`);
          history.go(0)
        } else {
          alert(`Error, ${type} cannot be created`)
        }
      }}
    >
      <Select
        labelText={`Items Amount`}
        inputProps = {{
          "value": name,
          "onChange": e => setName(e.target.value)
        }}
        formControlProps={{
          fullWidth: true
        }}
        items = {[{id: 1, value: "paper"}, {id: 2, value: "keyboard"}, {id: 3, value: "box"}]}
      />
      <Select
        labelText={`Employee`}
        inputProps = {{
          "value": name,
          "onChange": e => setName(e.target.value)
        }}
        formControlProps={{
          fullWidth: true
        }}
        items = {[{id: 1, value: "Employee 1"}]}
      />
      <Select
        labelText={`Seller`}
        inputProps = {{
          "value": name,
          "onChange": e => setName(e.target.value)
        }}
        formControlProps={{
          fullWidth: true
        }}
        items = {[{id: 1, value: "Seller 1"}]}
      />
      <Input
        labelText={`Items Amount`}
        inputProps = {{
        }}
        formControlProps={{
          fullWidth: true
        }}
      />
      <Button
        color="warning"
        type="submit"
      >
        Add {`${type}`}
      </Button>
    </form>
  );
}
