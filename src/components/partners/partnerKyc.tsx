import { Table, Tooltip, Button, Badge, Input, Space } from 'antd'
import {
  CommentOutlined,
  SearchOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import useShowHide from '../../hooks/useShowHide'
import KycReject from '../../components/partners/partnerKycReject'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import TripFeedBack from '../trips/tripFeedBack'
import KycApproval from '../partners/kycApproval'

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

const PartnerKyc = (props) => {
  const { partners } = props
  const initial = {
    commentData: [],
    commentVisible: false,
    title: '',
    approvalVisible: false,
    approvalData: []
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)
  const value = { reject: false }
  const { visible, onShow, onHide } = useShowHide(value)
  const columnsCurrent = [
    {
      title: 'Partner Code',
      dataIndex: 'cardcode',
      width: '10%',
      render: (text, record) => {
        return (
          <Link href='partners/[id]' as={`partners/${record.cardcode}`}>
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
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Partner',
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
          <Input placeholder='Search Partner Name' id='name' name='name' />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'On Boarded By',
      width: '10%',
      render: (text, record) => {
        return text && text.length > 12 ? (
          <Tooltip title={record.onboarded_by && record.onboarded_by.name}>
            <span> {record.onboarded_by && record.onboarded_by.name.slice(0, 12) + '...'}</span>
          </Tooltip>
        ) : (
          record.onboarded_by && record.onboarded_by.name
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
      title: 'Registered At',
      dataIndex: 'date',
      width: '10%',
      render: (text, record) => {
        return text && text.length > 12 ? (
          <Tooltip title={text}>
            <span> {text.slice(0, 12) + '...'}</span>
          </Tooltip>
        ) : (
          text
        )
      }
    },
    {
      title: 'Trucks',
      dataIndex: 'count',
      width: '7%',
      filters: truckCount
    },
    {
      title: 'PAN',
      dataIndex: 'pan',
      width: '8%'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '9%',
      render: (text, record) => {
        return text && text.length > 12 ? (
          <Tooltip title={text}>
            <span> {text.slice(0, 12) + '...'}</span>
          </Tooltip>
        ) : (
          text
        )
      },
      filters: kycStatusList
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      width: '11%',
      render: (text, record) => {
        return text && text.length > 12 ? (
          <Tooltip title={text}>
            <span> {text.slice(0, 12) + '...'}</span>
          </Tooltip>
        ) : (
          text
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '9%',
      render: (text, record) => (
        <Space>
          <Tooltip title='Comment'>
            <Button
              type='link'
              icon={<CommentOutlined />}
              onClick={() => handleShow('commentVisible', null, 'commentData', record.previousComment)}
            />
          </Tooltip>
          <Button
            type='primary'
            size='small'
            shape='circle'
            className='btn-success'
            icon={<CheckOutlined />}
            onClick={() =>
              handleShow('approvalVisible', null, 'approvalData', record)}
          />
          <Button
            type='primary'
            size='small'
            shape='circle'
            danger
            icon={<CloseOutlined />}
            onClick={() => onShow('reject')}
          />
        </Space>
      )
    }
  ]

  return (
    <>
      <Table
        columns={columnsCurrent}
        dataSource={partners}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1256 }}
        pagination={false}
        className='withAction'
      />
      {object.commentVisible && (
        <TripFeedBack
          visible={object.commentVisible}
          data={object.commentData}
          onHide={handleHide}
        />
      )}
      {visible.reject && <KycReject visible={visible.reject} onHide={onHide} />}
      {object.approvalVisible && (
        <KycApproval
          visible={object.approvalVisible}
          onHide={handleHide}
          data={object.approvalData}
        />
      )}
    </>
  )
}

export default PartnerKyc
