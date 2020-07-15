import { Table } from 'antd'
import mock from '../../../mock/partner/partnerKyc'

const PartnerKyc = () => {
  const columnsCurrent = [
    {
      title: 'Partner Code',
      dataIndex: 'code',
    },
    {
      title: 'Partner Name',
      dataIndex: 'name'
    },
    {
      title: 'Region',
      dataIndex: 'region'
    },
    {
      title: 'On Boarded By',
      dataIndex: 'boardedBy'
    },
    {
      title: 'Contact No',
      dataIndex: 'number'
    },
    {
      title: 'Truck Count',
      dataIndex: 'count',
    },
    {
        title: 'Registration Date',
        dataIndex: 'date',
      },
      {
        title: 'PAN',
        dataIndex: 'pan'
      },
      {
        title: 'KYC Status',
        dataIndex: 'status'
      },
      {
        title: 'Comment',
        dataIndex: 'comment',
      },
      {
          title: 'Action',
          dataIndex: 'action',
        },
  ]
  return (
    
      <Table
        columns={columnsCurrent}
        dataSource={mock}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    
  )
}

export default PartnerKyc
