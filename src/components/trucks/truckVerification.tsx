import { useState } from 'react'
import { Table, Button, Space ,Pagination} from "antd";
import mock from "../../../mock/partner/sourcingMock";
import Link from "next/link";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import useShowHide from "../../hooks/useShowHide";
import TruckReject from "../../components/trucks/truckReject";
import TruckActivation from "../trucks/truckActivation";
import useShowHideWithRecord from "../../hooks/useShowHideWithRecord";
import { gql, useQuery } from '@apollo/client'


const TRUCKS_QUERY = gql`
query trucks {
    truck( where: {truck_status: {name: {_in: ["Breakdown","Deactivated"],}}}) {
      truck_no
      truck_status {
        id
        name
      }
      partner {
        id
        cardcode
        name
      }
    }
    truck_aggregate(where:{truck_status: {name: {_in: ["Breakdown","Deactivated"],}}}){
      aggregate{
        count
     }
    }
  }
  
`
const status = [
  { value: 1, text: "Verification Pending" },
  { value: 2, text: "Rejected" },
];

const TruckVerification = (props) => {
 
  
  
  


  const initial = {
    reject: false,
    truckActivationVisible: false,
    truckActivationData: [],
  };

  const { visible, onShow, onHide } = useShowHide(initial);
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial);


  const { loading, error, data } = useQuery(TRUCKS_QUERY, {
    
    notifyOnNetworkStatusChange: true
  })

  console.log('TrucksVerification error', error)

  var truck = []
 
  
  if (!loading) {
  truck = data && data.truck
  
  }

 
 

  
  const columnsCurrent = [
    {
      title: "Truck No",
      dataIndex: "truck_no",
      render: (text, record) => {
        return (
          <Link href="trucks/[id]" as={`trucks/${record.truck_no}`}>
            <a>{record.truck_no}</a>
          </Link>
        );
      },
      width: "10%",
    },
    {
      title: "Partner Code",
      dataIndex: "code",
      render: (text, record) => {
        return (
          <Link href="partners/[id]" as={`partners/${record.partner && record.partner.cardcode}`}>
            <a>{record.partner && record.partner.cardcode}</a>
          </Link>
        );
      },
      width: "10%",
    },
    {
      title: "Partner",
      dataIndex: "partner",
      width: "18%",
      render: (text, record) => {
        return record.partner && record.partner.name;
      },
    },
    {
      title: "Truck Status",
      dataIndex: "status",
      filters: status,
      width: "17%",
      render: (text, record) => {
        return record.truck_status && record.truck_status.name;
      },
    },
    {
      title: "Action",
      width: "10%",
      render: (text, record) => {
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              shape="circle"
              className="btn-success"
              icon={<CheckOutlined />}
              onClick={() =>
                handleShow(
                  "truckActivationVisible",
                  null,
                  "truckActivationData",
                  record
                )
              }
            />
            <Button
              type="primary"
              size="small"
              shape="circle"
              danger
              icon={<CloseOutlined />}
              onClick={() => onShow("reject")}
            />
          </Space>
        );
      },
    },
    {
      title: "Reject Reason",
      dataIndex: "reason",
      width: "35%",
    },
  ];
  return (
    <>
      <Table
        columns={columnsCurrent}
        dataSource={truck}
        rowKey={(record) => record.id}
        size="middle"
        scroll={{ x: 1150 }}
        pagination={false}
        className="withAction"
       
      />
      
      {visible.reject && (
        <TruckReject visible={visible.reject} onHide={onHide} />
      )}
      {object.truckActivationVisible && (
        <TruckActivation
          visible={object.truckActivationVisible}
          onHide={handleHide}
          data={object.truckActivationData}
        />
      )}
    </>
  );
};

export default TruckVerification;
