import { Table, Pagination } from "antd";
import { useState } from "react";
import Link from "next/link";
import { EditTwoTone } from "@ant-design/icons";
import CreateBreakdown from "../../components/trucks/createBreakdown";
import PartnerUsers from "../partners/partnerUsers";
import CreatePo from "../../components/trips/createPo";
import useShowHidewithRecord from "../../hooks/useShowHideWithRecord";

const Trucks = (props) => {
  const initial = {
    usersData: [],
    usersVisible: false,
    poData: [],
    poVisible: false,
    editVisible: false,
    editData: [],
    title: "",
  };
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    trucks,
    status,
    loading,
    record_count,
    total_page,
    onPageChange,
    filter,
  } = props;
  console.log(props);

  const truckStatus = status.map((data) => {
    return { value: data.id.toString(), text: data.value };
  });

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit;
    setCurrentPage(page);
    onPageChange(newOffset);
  };

  const columns = [
    {
      title: "Truck No",
      dataIndex: "truck_no",
      render: (text, record) => {
        return (
          <Link href="trucks/[id]" as={`trucks/${record.truck_no}`}>
            <a>
              {record.truck_no}-{record.truck_type.value}
            </a>
          </Link>
        );
      },
    },
    {
      title: "Trip ID",
      dataIndex: "id",
      render: (text, record) => {
        const id = record && record.trips[0] ? record.trips[0].id : null;
        return (
          <span>
            {id && (
              <Link href="/trips/[id]" as={`/trips/${id} `}>
                <a>{id}</a>
              </Link>
            )}
          </span>
        );
      },
    },
    {
      title: "Trip",
      render: (text, record) => {
        const id = record && record.trips[0] ? record.trips[0].id : null;
        const source =
          record && record.trips[0] && record.trips[0].source
            ? record.trips[0].source.name
            : null;
        const destination =
          record && record.trips[0] && record.trips[0].destination
            ? record.trips[0].destination.name
            : null;
        return (
          <span>
            {id ? (
              <span>{source.slice(0, 3) + "-" + destination.slice(0, 3)}</span>
            ) : record.truck_status.id === 1 ? (
              <a
                className="link"
                onClick={() =>
                  handleShow(
                    "poVisible",
                    record.partner.name,
                    "poData",
                    record.truck_no
                  )
                }
              >
                Assign
              </a>
            ) : (
              "NA"
            )}
          </span>
        );
      },
    },
    {
      title: "Partner",
      dataIndex: "name",
      render: (text, record) => {
        return (
          <Link href="partners/[id]" as={`partners/${record.partner.cardcode}`}>
            <a>{record.partner.name}</a>
          </Link>
        );
      },
    },
    {
      title: "Phone No",
      dataIndex: "mobile",
      render: (text, record) => {
        const number =
          record.partner &&
          record.partner.partner_users &&
          record.partner.partner_users.length > 0 &&
          record.partner.partner_users[0].mobile
            ? record.partner.partner_users[0].mobile
            : "-";
        return (
          <span
            className="link"
            onClick={() =>
              handleShow("usersVisible", null, "usersData", record.partner)
            }
          >
            {number}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) =>
        record.truck_status && record.truck_status.value,
      filters: truckStatus,
    },
    {
      title: "City",
      render: (text, record) => {
        return record.city && record.city.name;
      },
    },
    {
      title: "",
      render: (text, record) => (
        <EditTwoTone
          onClick={() =>
            handleShow("editVisible", "Breakdown", "editData", record)
          }
        />
      ),
    },
  ];
  return (
    <>
      <Table
        rowSelection={{
          ...rowSelection,
        }}
        columns={columns}
        dataSource={trucks}
        rowKey={(record) => record.id}
        size="small"
        scroll={{ x: 1156 }}
        pagination={false}
        loading={loading}
      />
      {!loading && (
        <Pagination
          size="small"
          current={currentPage}
          pageSize={filter.limit}
          total={record_count}
          onChange={pageChange}
          className="text-right p10"
        />
      )}
      {object.usersVisible && (
        <PartnerUsers
          visible={object.usersVisible}
          partner={object.usersData}
          onHide={handleHide}
          title={object.title}
        />
      )}

      {object.editVisible && (
        <CreateBreakdown
          visible={object.editVisible}
          data={object.editData}
          onHide={handleHide}
          title={object.title}
        />
      )}

      {object.poVisible && (
        <CreatePo
          visible={object.poVisible}
          truck_no={object.poData}
          onHide={handleHide}
          title={object.title}
        />
      )}
    </>
  );
};

export default Trucks;
