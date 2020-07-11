import React, { Component } from "react";

import { Tabs } from "antd";
import CustomerList from "./customerList";
import RejectedList from "./rejectedList";
import NewCustomer from "./newCustomer";

const TabPane = Tabs.TabPane;

class Customer extends Component {
  render() {
    return (
      <Tabs>
        <TabPane tab="Customers" key="1">
          <CustomerList />
        </TabPane>
        <TabPane tab="Approval Pending" key="2">
          <NewCustomer />
        </TabPane>
        <TabPane tab="Rejected" key="3">
          <RejectedList />
        </TabPane>
      </Tabs>
    );
  }
}

export default Customer;
