import { Table, Radio,Tooltip, Button } from 'antd'
import {CommentOutlined} from '@ant-design/icons'
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
const kycStatusList=[
  { value: 1, text: 'verification Pending' },
  { value: 2, text: 'Document Pending' },
  { value: 3, text: 'Rejected' },
  { value: 4, text: 'Re-Verification' },
]
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const PartnerKyc = () => {
  const initial = { comment: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const columnsCurrent = [
    {
      title: 'Partner Code',
      dataIndex: 'code',
      key:'code',
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
      filterDropdown: (
        <div > 
              <Radio.Group >
        <Radio style={radioStyle} >
        0
        </Radio>
        <Radio style={radioStyle} >
       1-5
        </Radio>
        <Radio style={radioStyle} >
         {">5"}
        </Radio>
        <Radio style={radioStyle} >
          All
        </Radio>
      </Radio.Group>
      </div>
    ),
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
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    
  )
}

export default PartnerKyc
