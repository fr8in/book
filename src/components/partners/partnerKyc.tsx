import { Table, Tooltip, Button, Badge, Space, Modal,Pagination,Radio } from 'antd'
import {
  CommentOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import useShowHide from '../../hooks/useShowHide'
import KycReject from '../../components/partners/partnerKycReject'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import Comment from './comment'
import KycApproval from '../partners/kycApproval'
import { useState } from 'react'

const region_list = [
  { value: 1, text: 'North' },
  { value: 2, text: 'South-1' },
  { value: 3, text: 'South-2' },
  { value: 4, text: 'East-1' },
  { value: 5, text: 'East-2' },
  { value: 6, text: 'West-1' },
  { value: 7, text: 'West-2' }
]
const status_list = [
  { value: 1, text: 'Verification Pending' },
  { value: 2, text: 'Document Pending' },
  { value: 3, text: 'Rejected' },
  { value: 4, text: 'Re-Verification' }
]
const truck_count = [
  { value: 1, text: '0' },
  { value: 2, text: '1-5' },
  { value: 3, text: '>5' },
  { value: 4, text: 'All' }
]

const PartnerKyc = (props) => {
  const { partners, loading , onPageChange,filter,record_count,total_page,onFilter,partner_status_list} = props

  const [currentPage, setCurrentPage] = useState(1)
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

  const handleStatus = (e) => {
    onFilter(e.target.value)
  }

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }

  const partner_status = partner_status_list.map(data => {
    return { value: data.id, label: data.value }
  })

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
      }
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
      }
    },
    {
      title: 'On Boarded By',
      width: '10%',
      render: (text, record) => {
        const onboarded_by = record.onboarded_by && record.onboarded_by.name
        return onboarded_by.length > 12 ? (
          <Tooltip title={onboarded_by}>
            <span> {onboarded_by.slice(0, 12) + '...'}</span>
          </Tooltip>
        ) : (
          onboarded_by
        )
      }
    },
    {
      title: 'Region',
      width: '7%',
      filters: region_list,
      render: (text, record) => {
        const region = record.city && record.city.branch && record.city.branch.region.name
        return (region)
      }
    },
    {
      title: 'Contact No',
      width: '9%',
      render: (text, record) => {
        const number = record.partner_users && record.partner_users.length > 0 &&
        record.partner_users[0].mobile ? record.partner_users[0].mobile : '-'
        return (number)
      }

    },
    {
      title: 'Registered At',
      dataIndex: 'created_at',
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
      width: '7%',
      filters: truck_count,
      render: (text, record) => {
        const truckCount = record.trucks_aggregate && record.trucks_aggregate.aggregate &&
          record.trucks_aggregate.aggregate.count ? record.trucks_aggregate.aggregate.count : '-'
        return (truckCount)
      }
    },
    {
      title: 'PAN',
      dataIndex: 'pan',
      width: '8%'
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   width: '9%',
    //   render: (text, record) => {
    //     const status = record.partner_status && record.partner_status.value
    //     return status.length > 12 ? (
    //       <Tooltip title={status}>
    //         <span> {status.slice(0, 12) + '...'}</span>
    //       </Tooltip>
    //     ) : (
    //       status
    //     )
    //   },
    //   filters: status_list
    // },
    {
      title: 'Status',
      render: (text, record) => record.partner_status && record.partner_status.value,
      width: '14%',
      filterDropdown: (
        <Radio.Group
          options={partner_status}
          defaultValue={filter.partner_statusId[0]}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      )
      //, filterMultiple: false,
      // filters: customer_status,
      // onFilter: (value, record) => record.status && record.status.value.indexOf(value) === 0
    },
    {
      title: 'Comment',
      width: '11%',
      render: (text, record) => {
        const comment = record.partner_comments && record.partner_comments.length > 0 &&
        record.partner_comments[0].description ? record.partner_comments[0].description : '-'
        console.log('partners', partners)
        return comment && comment.length > 12 ? (
          <Tooltip title={comment}>
            <span> {comment.slice(0, 12) + '...'}</span>
          </Tooltip>
        ) : (
          comment
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
              onClick={() => handleShow('commentVisible', null, 'commentData', record.id)}
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
        loading={loading}
      />
      {object.commentVisible && (
        <Modal
          title='Comments'
          visible={object.commentVisible}
          onCancel={handleHide}
          bodyStyle={{ padding: 10 }}
        >
          <Comment partnerId={object.commentData} />
        </Modal>
      )}
      {visible.reject && <KycReject visible={visible.reject} onHide={onHide} />}
      {object.approvalVisible && (
        <KycApproval
          visible={object.approvalVisible}
          onHide={handleHide}
          data={object.approvalData}
        />
      )}
      {!loading &&
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          total={record_count}
          onChange={pageChange}
          className='text-right p10'
        />}
    </>
  )
}

export default PartnerKyc
