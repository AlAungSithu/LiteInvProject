import React, { useState } from "react";
// @material-ui/core components
// core components
import Input from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button";

import axios from "axios";
import { useHistory } from "react-router";

export default function PeopleForm(props) {
  const { url, type } = props;
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!(name && email)) {
          alert("Please input name and email");
          return;
        }
        let result = await axios(url, {
          params: {
            [`${type.toLowerCase()}_name`]: name,
            [`${type.toLowerCase()}_email`]: email
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
      <Input
        labelText={`${type} Name`}
        inputProps = {{
          "value": name,
          "onChange": e => setName(e.target.value)
        }}
        formControlProps={{
          fullWidth: true
        }}
      />
      <Input
        labelText={`${type} Email`}
        inputProps = {{
          "value": email,
          "onChange": e => setEmail(e.target.value)
        }}
        formControlProps={{
          fullWidth: true
        }}
      />
      <Button
        color="info"
        type="submit"
      >
        Add {`${type}`}
      </Button>
    </form>
  );
}
