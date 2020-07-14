import { Table } from "antd";
import Link from "next/link";
import cusMock from "../../../mock/customer/CustomerListMock";
import PageLayout from "../layout/pageLayout";

export default function CustomerList() {
  const columnsCurrent = [
    {
      title: "Customer",
      dataIndex: "name",
      render: (text, record) => {
        return (
          <Link
            href="customers/customer/[id]"
            as={`customers/customer/${record.id}`}
          >
            <a>{text}</a>
          </Link>
        );
      },
    },
    {
      title: "User Phone",
      dataIndex: "mobileNoList",
    },
    {
      title: "Orders",
      dataIndex: "noOfLoadsTaken",
      sorter: true,
    },
    {
      title: "systemMamul",
      dataIndex: "systemMamul",
    },
    {
      title: "Credit Limit",
      dataIndex: "creditLimit",
    },
    {
      title: "Receivables",
      dataIndex: "receivables",
    },
    {
      title: "Receivable Days",
      dataIndex: "workingCapitalDays",
    },
    {
      title: "Status",
      dataIndex: "Status",
    },
  ];

  return (
    <PageLayout title="Customer">
      <Table
        columns={columnsCurrent}
        dataSource={cusMock}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </PageLayout>
  );
}
