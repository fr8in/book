import { Table, Radio,Tooltip, Button,Col } from 'antd'
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

const RadioList =[
    { label:'0' ,value: '1' },
    { label:'1-5' ,value: '2' },
    { label:'>5' ,value: '3' },
    { label:'All' ,value: '4' },
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
      width:'8%',
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
      width:'11%',
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
      width:'9%',
      filterDropdown: (
        <div >  
              <Radio.Group options={RadioList}  />
      </div>
    ),
      key:'count',
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
        key:'status',
        width:'9%',
        filters: kycStatusList
      },
      {
        title: 'Comment',
        dataIndex: 'comment',
        width:'9%',
        key:'comment',
      },
      {
          title: 'Action',
          dataIndex: 'action',
          key:'action',
          width:'10%',
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
        scroll={{ x: 1556 }}
        pagination={false}
      />
    
  )
}

export default PartnerKyc
