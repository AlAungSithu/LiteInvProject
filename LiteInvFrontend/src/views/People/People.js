import React from "react";

// core components
import PeopleCard from "components/PeopleCard/PeopleCard.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";

export default function People() {
  return (
    <CustomTabs
      title=""
      headerColor="primary"
      tabs={[
        {
          tabName: "Sellers",
          tabContent: (
            <PeopleCard
              title="Entities from whom we are supplied the items"
              type="Seller"
              createUrl="https://us-central1-liteinvbackend.cloudfunctions.net/create_seller"
              retrieveUrl="https://us-central1-liteinvbackend.cloudfunctions.net/retrieve_seller"
              updateUrl="https://us-central1-liteinvbackend.cloudfunctions.net/update_seller"
              deleteUrl="https://us-central1-liteinvbackend.cloudfunctions.net/delete_seller"
            />
          )
        },
        {
          tabName: "Employees",
          tabContent: (
            <PeopleCard
              title="Our personal"
              type="Employee"
              createUrl="https://us-central1-liteinvbackend.cloudfunctions.net/create_employee"
              retrieveUrl="https://us-central1-liteinvbackend.cloudfunctions.net/retrieve_employee"
              updateUrl="https://us-central1-liteinvbackend.cloudfunctions.net/update_employee"
              deleteUrl="https://us-central1-liteinvbackend.cloudfunctions.net/delete_employee"
            />
          )
        },
        {
          tabName: "Customers",
          tabContent: (
            <PeopleCard
              title="Our valued customers"
              type="Customer"
              createUrl="https://us-central1-liteinvbackend.cloudfunctions.net/create_customer"
              retrieveUrl="https://us-central1-liteinvbackend.cloudfunctions.net/retrieve_customer"
              updateUrl="https://us-central1-liteinvbackend.cloudfunctions.net/update_customer"
              deleteUrl="https://us-central1-liteinvbackend.cloudfunctions.net/delete_customer"
            />
          )
        }
      ]}
    />
  );
}
