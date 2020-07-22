import { Table, Radio, Tooltip, Button, Col, Badge, Row } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import mock from '../../../mock/partner/partnerKyc'
import Link from 'next/link'
import useShowHide from '../../hooks/useShowHide'

const regionList = [
  { value: 1, text: 'North' },
  { value: 2, text: 'South-1' },
  { value: 3, text: 'East-1' },
  { value: 4, text: 'West-1' },
  { value: 5, text: 'south-2' },
  { value: 6, text: 'East-2' },
  { value: 7, text: 'west-2' }
]
const kycStatusList = [
  { value: 1, text: 'verification Pending' },
  { value: 2, text: 'Document Pending' },
  { value: 3, text: 'Rejected' },
  { value: 4, text: 'Re-Verification' },
]


const PartnerKyc = () => {
  const initial = { comment: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  function onChange(checkedValues) {
    console.log('checked = ', checkedValues);
  }
  const columnsCurrent = [
    {
      title: 'Partner Code',
      dataIndex: 'code',
      key:'code',
      width:'8%',
      render: (text, record) => {
        return (
          <Link href="partners/[id]" as={`partners/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      },
    },
    {
      title: 'Partner Name',
      dataIndex: 'name',
      key:'name',
      className: 'pl10',
      render: (text, record) => {
        return (
          <span>
            <Badge dot style={{ backgroundColor: '#28a745' }} />
            <a>{text}</a>
          </span>
        )
      },
      width: '8%',
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key:'region',
      width:'8%',
      filters: regionList
    },
    {
      title: 'On Boarded By',
      dataIndex: 'boardedBy',
      key:'boardedBy',
      render: (text, record) => {
        return (
          <a>{record.remarks && record.remarks.length > 12 ? (
            <Tooltip title={record.remarks}>
              <span> {record.remarks.slice(0, 12) + "..."}</span>
            </Tooltip>
          ) : text}
          </a>
        )
      },
      width: '11%',
    },
    {
      title: 'Contact No',
      dataIndex: 'number',
      key:'number',
      width:'10%',
    },
    {
      title: 'Truck Count',
      dataIndex: 'count',
      key: 'count',
      width:'9%',
      filterDropdown: (
        <div>
          <Radio.Group onChange={onChange}>
            <Row gutter={10}>
              <Col xs={{ span: 24 }} sm={{ span: 24 }}>
                <Radio value={1}>0</Radio>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }}>
                <Radio value={2}>1-5</Radio>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }}>
                <Radio value={3}>{">5"}</Radio>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }}>
                <Radio value={4}>All</Radio>
              </Col>
            </Row>
          </Radio.Group>
        </div>
      ),
    },
    {
      title: 'Registration Date',
      dataIndex: 'date',
      key:'date',
      width:'9%',
    },
    {
      title: 'PAN',
      dataIndex: 'pan',
      key:'pan',
      width:'9%',
    },
    {
      title: 'KYC Status',
      dataIndex: 'status',
      key: 'status',
      width: '9%',
      filters: kycStatusList
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      width: '9%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <span className='actions'>
          <Tooltip title='Comment'>
            <Button type='link' icon={<CommentOutlined />} onClick={() => onShow('comment')} />
          </Tooltip>
        </span>
      ),
    },
  ]
  return (

    <Table
      columns={columnsCurrent}
      dataSource={mock}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 956 }}
      pagination={false}
    />

  )
}
export default PartnerKyc
