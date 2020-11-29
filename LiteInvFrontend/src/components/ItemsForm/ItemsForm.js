import React, { useState } from "react";
// @material-ui/core components
// core components
import Input from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button";

import axios from "axios";
import { useHistory } from "react-router";

export default function ItemsForm(props) {
  const { url } = props
  const history = useHistory()
  const [name, setName] = useState("")
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!(name)) {
          alert("Please input item name");
          return;
        }
        try {
          let result = await axios(url, {
            params: {
              item_name: name
            }
          });
          if (result.status === 201) {
            alert(`${result.data[0][`Item Name`]} (Id: ${result.data[0][`Item Id`]}) is successfully created`);
            history.go(0)
          }
        } catch (error) {
          alert(`${error.response.data[0]["Error Message"]}`)
        }
      }}
    >
      <Input
        labelText={`Item Name`}
        inputProps = {{
          "value": name,
          "onChange": e => setName(e.target.value)
        }}
        formControlProps={{
          fullWidth: true
        }}
      />
      <Button
        color="rose"
        type="submit"
      >
        Add Item
      </Button>
    </form>
  );
}
