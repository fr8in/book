import { Table } from 'antd'


const PartnerKyc = () => {
  const columnsCurrent = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'number'
    },
    {
      title: 'City',
      dataIndex: 'cityName'
    },
    {
      title: 'Owner',
      dataIndex: 'owner'
    },
    {
      title: 'Source',
      dataIndex: 'source'
    },
    {
      title: 'Status',
      dataIndex: 'sttaus',
    },
    {
        title: 'Last Comment',
        dataIndex: 'comment',
      },
      {
        title: 'Created Date',
        dataIndex: 'date',
        sorter: true
      },
      {
        title: 'Priority',
        dataIndex: 'priority'
      },
      {
          title: 'Action',
          dataIndex: 'action',
        },
  ]
  return (
    
      <Table
        columns={columnsCurrent}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
   
  )
}

export default PartnerKyc
