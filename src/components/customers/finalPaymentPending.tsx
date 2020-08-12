import { Table } from "antd";
//import finalPayment from "../../../mock/customer/finalPayment";
import Link from "next/link";

const FinalPaymentsPending = (props) => {
  const { finalPayment } = props;
  console.log("finalPayment", finalPayment);

  const finalPaymentsPending = [
    {
      title: "LoadId",
      dataIndex: "id",
      sorter: (a, b) => (a.loadId > b.loadId ? 1 : -1),
      width: "6%",
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
      dataIndex: "truck_no",
      sorter: (a, b) => (a.truckN0 > b.truckNo ? 1 : -1),
      width: "10%",
      render: (text, record) => record.truck && record.truck.truck_no,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: "15%",
      render: (text, record) =>
        record.truck.truck_type && record.truck.truck_type.name,
    },

    {
      title: "SO Price",
      dataIndex: "soPrice",
      sorter: (a, b) => (a.soPrice > b.soPrice ? 1 : -1),
      width: "10%",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1),
      width: "10%",
    },
    {
      title: "Aging",
      dataIndex: "aging",
      sorter: (a, b) => (a.aging > b.aging ? 1 : -1),
      width: "10%",
    },
  ];

  return (
    <Table
      columns={finalPaymentsPending}
      dataSource={finalPayment}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ x: 800 }}
      pagination={false}
    />
  );
};

export default FinalPaymentsPending;
