import { Table, Tooltip, Button, Badge, Input } from 'antd'
import { CommentOutlined, SearchOutlined } from '@ant-design/icons'
import mock from '../../../mock/partner/partnerKyc'
import Link from 'next/link'

const regionList = [
  { value: 1, text: 'North' },
  { value: 2, text: 'South-1' },
  { value: 3, text: 'South-2' },
  { value: 4, text: 'East-1' },
  { value: 5, text: 'East-2' },
  { value: 6, text: 'West-1' },
  { value: 7, text: 'West-2' }
]
const kycStatusList = [
  { value: 1, text: 'Verification Pending' },
  { value: 2, text: 'Document Pending' },
  { value: 3, text: 'Rejected' },
  { value: 4, text: 'Re-Verification' }
]
const truckCount = [
  { value: 1, text: '0' },
  { value: 2, text: '1-5' },
  { value: 3, text: '>5' },
  { value: 4, text: 'All' }
]

const PartnerKyc = () => {
  const columnsCurrent = [
    {
      title: 'Partner Code',
      dataIndex: 'code',
      width: '10%',
      render: (text, record) => {
        return (
          <Link href='partners/[id]' as={`partners/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Partner Code'
            id='code'
            name='code'
            type='number'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Partner Name',
      dataIndex: 'name',
      width: '10%',
      render: (text, record) => {
        return (
          <span>
            <Badge dot style={{ backgroundColor: '#28a745' }} />
            <span>{text}</span>
          </span>
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Partner Name'
            id='name'
            name='name'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'On Boarded By',
      dataIndex: 'boardedBy',
      width: '10%',
      render: (text, record) => {
        return (
          text && text.length > 12 ? (
            <Tooltip title={text}>
              <span> {text.slice(0, 12) + '...'}</span>
            </Tooltip>
          ) : text
        )
      }
    },
    {
      title: 'Region',
      dataIndex: 'region',
      width: '7%',
      filters: regionList
    },
    {
      title: 'Contact No',
      dataIndex: 'number',
      width: '9%'
    },
    {
      title: 'Registration Date',
      dataIndex: 'date',
      width: '10%',
      render: (text, record) => {
        return (
          text && text.length > 12 ? (
            <Tooltip title={text}>
              <span> {text.slice(0, 12) + '...'}</span>
            </Tooltip>
          ) : text
        )
      }
    },
    {
      title: 'Trucks',
      dataIndex: 'count',
      width: '9%',
      filters: truckCount
    },
    {
      title: 'PAN',
      dataIndex: 'pan',
      width: '9%'
    },
    {
      title: 'KYC Status',
      dataIndex: 'status',
      width: '9%',
      render: (text, record) => {
        return (
          text && text.length > 12 ? (
            <Tooltip title={text}>
              <span> {text.slice(0, 12) + '...'}</span>
            </Tooltip>
          ) : text
        )
      },
      filters: kycStatusList
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      width: '8%',
      render: (text, record) => {
        return (
          text && text.length > 12 ? (
            <Tooltip title={text}>
              <span> {text.slice(0, 12) + '...'}</span>
            </Tooltip>
          ) : text
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '9%',
      render: (text, record) => (
        <span className='actions'>
          <Tooltip title='Comment'>
            <Button type='link' icon={<CommentOutlined />} />
          </Tooltip>
        </span>
      )
    }
  ]
  return (
    <Table
      columns={columnsCurrent}
      dataSource={mock}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 1256 }}
      pagination={false}
      className='withAction'
    />
  )
}

export default PartnerKyc
