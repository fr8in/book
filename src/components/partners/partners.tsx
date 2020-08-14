import { Table, Tooltip, Button, Badge, Space, Modal, Pagination, Radio, Input } from 'antd'
import {
  CommentOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import KycReject from '../../components/partners/partnerKycReject'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import Comment from './comment'
import KycApproval from '../partners/kycApproval'
import { useState } from 'react'
import moment from 'moment'

const region_list = [
  { value: 1, text: 'North' },
  { value: 2, text: 'South-1' },
  { value: 3, text: 'South-2' },
  { value: 4, text: 'East-1' },
  { value: 5, text: 'East-2' },
  { value: 6, text: 'West-1' },
  { value: 7, text: 'West-2' }
]

const truck_count = [
  { value: 1, text: '0' },
  { value: 2, text: '1-5' },
  { value: 3, text: '>5' },
  { value: 4, text: 'All' }
]

const PartnerKyc = (props) => {
  const {
     partners,
     loading, 
     onPageChange, 
     filter, 
     record_count, 
     total_page, 
     onFilter, 
     partner_status_list, 
     onNameSearch, 
     onCardCodeSearch 
    } = props

  const [currentPage, setCurrentPage] = useState(1)
  const initial = {
    commentData: [],
    commentVisible: false,
    title: '',
    approvalVisible: false,
    approvalData: [],
    rejectVisible: false,
    rejectData: []
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)
  const value = { reject: false }


  const handleStatus = (e) => {
    onFilter(e.target.value)
  }

  const handleName = (e) => {
    onNameSearch(e.target.value)
  }

  const handleCardCode = (e) => {
    onCardCodeSearch(e.target.value)
  }

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }

  const partner_status = partner_status_list && partner_status_list.map(data => {
    return { value: data.id, label: data.name }
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
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Partner'
            value={filter.cardcode}
            onChange={handleCardCode}
          />
        </div>
      ),
      filterIcon: () => <SearchOutlined style={{ color: filter.cardcode ? '#1890ff' : undefined }} />
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
          <Input
            placeholder='Search Partner'
            value={filter.name}
            onChange={handleName}
          />
        </div>
      ),
      filterIcon: () => <SearchOutlined style={{ color: filter.name ? '#1890ff' : undefined }} />
    },
    {
      title: 'On Boarded By',
      width: '10%',
      render: (text, record) => {
        const onboarded_by = record.onboarded_by && record.onboarded_by.name
        return onboarded_by && onboarded_by.length > 12 ? (
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
      render:(text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
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
    {
      title: 'Status',
      render: (text, record) => record.partner_status && record.partner_status.name,
      width: '14%',
      filterDropdown: (
        <Radio.Group
          options={partner_status}
          defaultValue={filter.partner_statusId[0]}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      )
    },
    {
      title: 'Comment',
      width: '11%',
      render: (text, record) => {
        const comment = record.partner_comments && record.partner_comments.length > 0 &&
        record.partner_comments[0].description ? record.partner_comments[0].description : '-'
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
            onClick={() => 
              handleShow('rejectVisible', null, 'rejectData', record.id)}
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
          <Comment partner_id={object.commentData} />
        </Modal>
      )}
      {object.rejectVisible && ( 
         <Modal
         title='Reject Partner'
         visible={object.rejectVisible}
         onCancel={handleHide}
         footer= {null}
         
       >
        <KycReject partner_id={object.rejectData} />
      </Modal>
      )}
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

