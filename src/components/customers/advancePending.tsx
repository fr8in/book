import { Table } from "antd";
//import finalPayment from "../../../mock/customer/finalPayment";
import Link from "next/link";
const statusList = [
  { value: 1, text: "Advance is Pending" },
  { value: 11, text: "Received Amount< Customer Advance %" },
];

const AdvancePending = (props) => {
  const { advance_Pending } = props;
  const advancePending = [
    {
      title: "Load Id",
      dataIndex: "id",
      sorter: (a, b) => (a.loadId > b.loadId ? 1 : -1),
      width: "8%",
      render: (text, record) => {
        return (
          <Link href="/trips/[id]" as={`/trips/${record.id} `}>
            <a>{text}</a>
          </Link>
        );
      },
    },
    {
      title: "Order",
      dataIndex: "order_date",
      sorter: (a, b) => (a.order > b.order ? 1 : -1),
      width: "5%",
    },
    {
      title: "Truck No",
      dataIndex: "truckNo",
      sorter: (a, b) => (a.truckNo > b.truckNo ? 1 : -1),
      width: "7%",
      render: (text, record) => record.truck && record.truck.truck_no,
    },
    {
      title: "Source",
      dataIndex: "source",
      width: "7%",
      render: (text, record) => record.source && record.source.name,
    },
    {
      title: "Destination",
      dataIndex: "destination",
      width: "10%",
      render: (text, record) => record.destination && record.destination.name,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: "10%",
      render: (text, record) =>
        record.truck.truck_type && record.truck.truck_type.name,
    },
    {
      title: "Status",
      dataIndex: "trip_status",
      filters: statusList,
      width: "12%",
      render: (text, record) => record.trip_status && record.trip_status.name,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      sorter: (a, b) => (a.userName > b.userName ? 1 : -1),
      width: "10%",
      render: (text, record) =>
        record.customer_users && record.customer_users.name,
    },
    {
      title: "Customer Price",
      dataIndex: "price",
      sorter: (a, b) => (a.price > b.price ? 1 : -1),
      width: "11%",
    },
    {
      title: "Received",
      dataIndex: "received",
      sorter: (a, b) => (a.received > b.received ? 1 : -1),
      width: "5%",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1),
      width: "5%",
    },
    {
      title: "Aging",
      dataIndex: "aging",
      sorter: (a, b) => (a.aging > b.aging ? 1 : -1),
      width: "5%",
    },
  ];

  return (
    <Table
      columns={advancePending}
      dataSource={advance_Pending}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ x: 800 }}
      pagination={false}
    />
  );
};

export default AdvancePending;
