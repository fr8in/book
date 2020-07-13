import { Tabs } from "antd";
import CustomerList from "../../components/customers/customerList";
import NewCustomer from "../../components/customers/newCustomer";
import PageLayout from "../../components/layout/PageLayout";
import { Input } from "antd";

const { Search } = Input;

const TabPane = Tabs.TabPane;

const Customers = () => {
  return (
    <PageLayout title="Customers">
      <Tabs>
        <TabPane tab="Customers" key="1">
          <Search
            placeholder="Search..."
            onSearch={(value) => console.log(value)}
            style={{ width: 200 }}
          />
          <br />
          <br />
          <CustomerList />
        </TabPane>
        <TabPane tab="Approval Pending" key="2">
          <Search
            placeholder="PAN or Name or Mobile..."
            onSearch={(value) => console.log(value)}
            style={{ width: 200 }}
          />
          <br />
          <br />
          <NewCustomer />
        </TabPane>
        <TabPane tab="Rejected" key="3">
          <Search
            placeholder="PAN or Name or Mobile..."
            onSearch={(value) => console.log(value)}
            style={{ width: 200 }}
          />
          <br />
          <br />
          <NewCustomer />
        </TabPane>
      </Tabs>
    </PageLayout>
  );
};

export default Customers;
