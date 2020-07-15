import React from 'react'
import { Table } from 'antd'
import PageLayout from '../../layout/pageLayout'


const walletTopup = () => {
  const columnsCurrent = [
    {
      title: 'Order Id',
      dataIndex: 'orderId',
    },
    {
      title: 'AP Date',
      dataIndex: 'apDate'
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate'
    },
    {
      title: 'Price',
      dataIndex: 'price'
    },
    {
        title: 'Balance',
        dataIndex: 'balance'
      },
      {
        title: 'Top Up',
        dataIndex: 'topUp'
      },
      {
        title: 'Deduction',
        dataIndex: 'deduction'
      },
]
    return (
        <PageLayout title='Partners'>
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
    
    export default walletTopup
    