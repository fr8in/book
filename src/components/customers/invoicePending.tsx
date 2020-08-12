import { Table } from "antd";
//import finalPayment from "../../../mock/customer/finalPayment";
import Link from "next/link";
const InvoicePending = (props) => {
  const { invoice_Pending } = props;
  const invoicePending = [
    {
      title: "Load Id",
      dataIndex: "id",
      sorter: (a, b) => (a.loadId > b.loadId ? 1 : -1),
      width: "10%",
      render: (text, record) => {
        return (
          <Link href="/trips/[id]" as={`/trips/${record.id} `}>
            <a>{text}</a>
          </Link>
        );
      },
    },
    {
      title: "Source",
      dataIndex: "source",
      width: "10%",
      render: (text, record) => record.source && record.source.name,
    },
    {
      title: "Destination",
      dataIndex: "destination",
      width: "10%",
      render: (text, record) => record.destination && record.destination.name,
    },
    {
      title: "Truck No",
      dataIndex: "truckNo",
      width: "10%",
      render: (text, record) => record.truck && record.truck.truck_no,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: "10%",
      render: (text, record) =>
        record.truck.truck_type && record.truck.truck_type.name,
    },

    {
      title: "SO Price",
      dataIndex: "soPrice",
      sorter: (a, b) => (a.soPrice > b.soPrice ? 1 : -1),
      width: "15%",
    },
    {
      title: "Received",
      dataIndex: "received",
      sorter: (a, b) => (a.received > b.received ? 1 : -1),
      width: "10%",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1),
      width: "10%",
    },
  ];

  return (
    <Table
      columns={invoicePending}
      dataSource={invoice_Pending}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ x: 800 }}
      pagination={false}
    />
  );
};

export default InvoicePending;
