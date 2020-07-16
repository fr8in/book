import { Table } from 'antd'
import mock from '../../../mock/partner/partnerKyc'

const regionList = [
  { value: 1, text: 'North' },
  { value: 2, text: 'South-1' },
  { value: 3, text: 'East-1' },
  { value: 4, text: 'West-1' },
  { value: 5, text: 'south-2' },
  { value: 6, text: 'East-2' },
  { value: 7, text: 'west-2' }
]
const kycStatusList=[
  { value: 1, text: 'verification Pending' },
  { value: 2, text: 'Document Pending' },
  { value: 3, text: 'Rejected' },
  { value: 4, text: 'Re-Verification' },
]
const PartnerKyc = () => {
  const columnsCurrent = [
    {
      title: 'Partner Code',
      dataIndex: 'code',
      key:'code',
    },
    {
      title: 'Partner Name',
      dataIndex: 'name',
      key:'name',
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key:'region',
      filters: regionList
    },
    {
      title: 'On Boarded By',
      dataIndex: 'boardedBy',
      key:'boardedBy',
    },
    {
      title: 'Contact No',
      dataIndex: 'number',
      key:'number',
    },
    {
      title: 'Truck Count',
      dataIndex: 'count',
      key:'count',
    },
    {
        title: 'Registration Date',
        dataIndex: 'date',
        key:'date',
      },
      {
        title: 'PAN',
        dataIndex: 'pan',
        key:'pan',
      },
      {
        title: 'KYC Status',
        dataIndex: 'status',
        key:'status',
        filters: kycStatusList
      },
      {
        title: 'Comment',
        dataIndex: 'comment',
        key:'comment',
      },
      {
          title: 'Action',
          dataIndex: 'action',
          key:'action',
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
