import React from 'react'
import { Table } from 'antd'
import PageLayout from '../layout/pageLayout'


const Partners = () => {
  const columnsCurrent = [
    {
      title: 'Tag Id',
      dataIndex: 'id',
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo'
    },
    {
      title: 'ST Code',
      dataIndex: 'stCode'
    },
    {
      title: 'Partner',
      dataIndex: 'partner'
    }]
    return (
        <PageLayout title='Cards'>
          <Table
            columns={columnsCurrent}
            rowKey={record => record.id}
            size='middle'
            scroll={{ x: 800, y: 400 }}
            pagination={false}
          />
        </PageLayout>
      )
    }
    
    export default Partners
    