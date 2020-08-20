import { Table, Tooltip, Input,  Checkbox } from "antd";
import Link from "next/link";
import moment from "moment";

const ongoingTrips = (props) => {
  const {trips,loading} = props;
  
const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "7%",
      render: (text, record) => {
        return (
          <Link href="/trips/[id]" as={`/trips/${record.id} `}>
            <a>{text}</a>
          </Link>
        );
      }
    },
    {
      title: (
        <Tooltip title="Order date">
          <span>O.Date</span>
        </Tooltip>
      ),
      dataIndex: "order_date",
      key: "order_date",
      render: (text, record) => {
        return text ? moment(text).format("DD-MMM-YY") : "";
      },
      width: "8%",
    },
    {
      title: "Partner",
      render: (text, record) => {
        return (
          <Link
            href="/partners/[id]"
            as={`/partners/${record.partner && record.partner.cardcode} `}
          >
            {record.partner.name &&
            record.partner.name.length > 12 ? (
              <Tooltip title={record.partner && record.partner.name}>
                <a>
                  {record.partner && record.partner.name.slice(0, 12) + "..."}
                </a>
              </Tooltip>
            ) : (
              <a>{record.partner && record.partner.name}</a>
            )}
          </Link>
        );
      },
      width: "10%",
    },
    {
      title: "Truck",
      render: (text, record) => {
        return (
          <Link
            href="/trucks/[id]"
            as={`/trucks/${record.truck && record.truck.truck_no} `}
          >
            <a>{record.truck && record.truck.truck_no}</a>
          </Link>
        );
      },
      width: "10%",
    },
    {
      title: "Source",
      width: "9%",
      render: (text, record) => {
        return text > 8 ? (
          <Tooltip title={record.source.name}>
            <span>{record.source.name.slice(0, 8) + "..."}</span>
          </Tooltip>
        ) : (
          record.source.name
        );
      }
    },
    {
      title: "Destination",
      width: "10%",
      render: (text, record) => {
        return text > 8 ? (
          <Tooltip title={record.destination.name}>
            <span>{record.destination.name.slice(0, 8) + "..."}</span>
          </Tooltip>
        ) : (
          record.destination.name
        );
      },
    },
    {
      title: "Status",
      render: (text, record) => record.trip_status && record.trip_status.name,
      width: "12%",
      filterDropdown: (
        <Checkbox.Group
          className="filter-drop-down"
        />
      ),
    },
    {
      title: "SO Price",
      render: (record) => {
        console.log();
        return (
          record.trip_prices &&
          record.trip_prices.length > 0 &&
          record.trip_prices[0].customer_price
        );
      },
      width: "8%",
    },
    {
      title: "PO Price",
      render: (record) => {
        return (
          record.trip_prices &&
          record.trip_prices.length > 0 &&
          record.trip_prices[0].partner_price
        );
      },
      width: "8%",
    },
    {
      title: "Trip KM",
      dataIndex: "km",
      key: "km",
      width: "8%",
    },
  ];
  return (
      <Table
        columns={columns}
        dataSource={trips}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 1156 }}
        pagination={false}
        loading={loading}
      />
     
  );
};

export default ongoingTrips;
