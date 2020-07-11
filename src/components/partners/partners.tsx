import React from 'react'
import {Table} from "antd";
import mock from '../../../mock/partner/partnerData';
import PageLayout from '../layout/PageLayout'


const Partners = () => {
  const columnsCurrent = [
    {
        title: "Partner Code",
        dataIndex: "partnerCode",               
    },
    {
        title: "Partner",
        dataIndex: "name",
    },
    {
        title: "Region",
        dataIndex: "regionName",
    },
    {
        title: "Contact No",
        dataIndex: "mobileNo",
    },
    {
        title: "Email",
        dataIndex: "email",
    },
    {
        title: "Avg Km/day",
        dataIndex: "averageKm",
        sorter: true
    },
    {
        title: "Trucks",
        dataIndex: "truckCount",
    },
    {
        title: "Invoiced",
        dataIndex: "invoiceAmount",  
    },
    {
        title: "Invoice Pending",
        dataIndex: "invoicePendingAmount",              
    },
    {
        title: "Status",
        dataIndex: "active",
    },
];
  return (
    <PageLayout title='Partners'>
             <Table
                columns={columnsCurrent}
                dataSource={mock}
                rowKey={record => record.id}
                size='middle'
                scroll={{ x: 800, y: 400 }}
                pagination={false}
            />
    </PageLayout>
  )
}

export default Partners
