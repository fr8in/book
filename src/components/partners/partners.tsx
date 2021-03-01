import { Table, Tooltip, Button, Space, Modal, Pagination, Radio, Input,Avatar,Badge,Checkbox } from 'antd'
import {
  CommentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SearchOutlined,
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons'
import LinkComp from '../common/link'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import Comment from './comment'
import { useState } from 'react'
import moment from 'moment'
import Truncate from '../common/truncate'
import get from 'lodash/get'
import Phone from '../common/phone'

const PartnerKyc = (props) => {
  const {
    partners,
    loading,
    onPageChange,
    filter,
    record_count,
    onFilter,
    onRegionFilter,
    region_list,
    partner_status_list,
    onNameSearch,
    onCardCodeSearch,
    partner_active_category,
    onPartnerFilter
  } = props

  const [currentPage, setCurrentPage] = useState(1)
  const initial = {
    partner_id: null,
    commentVisible: false,
    title: '',
    approvalVisible: false,
    rejectVisible: false
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

  const handleStatus = (e) => {
    onFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleRegionStatus = (checked) => {
    onRegionFilter(checked)
    setCurrentPage(1)
  }

  const handlePartnerActiveCategory = (checked) => {
    onPartnerFilter(checked)
    setCurrentPage(1)
  }

  const handleCardCode = (e) => {
    onCardCodeSearch(e.target.value)
    setCurrentPage(1)
  }

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }

  const partner_status = partner_status_list && partner_status_list.map(data => {
    return { value: data.id, label: data.name }
  })

  const regions = region_list && region_list.map(data => {
    return { value: data.name, label: data.name }
  })

  const partner_active_category_list = partner_active_category && partner_active_category.map(data => {
    return { value: data.id, label: data.name }
  })

  
  const columnsCurrent = [
    {
      title: 'C.Code',
      dataIndex: 'cardcode',
      width: '8%',
      render: (text, record) => {
        return (
          <LinkComp type='partners' data={text} id={record.cardcode} />
        )
      },
      filterDropdown: (
        <Input
          placeholder='Search Partner'
          value={filter.cardcode}
          onChange={handleCardCode}
        />
      ),
      filterIcon: () => <SearchOutlined style={{ color: filter.cardcode ? '#1890ff' : undefined }} />
    },
    {
      title: 'Partner',
      dataIndex: 'name',
      width: '10%',
      render: (text, record) => {
        const active_category_id =  get(record, 'active_category_id', null)
        const count = (active_category_id === 2) ?<Avatar  style={{ backgroundColor: '#3b7ddd',fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px'}} icon={<PlusOutlined />} /> : (active_category_id === 3) ?<Avatar  style={{ backgroundColor: '#28a745',fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px'}} icon={<ArrowUpOutlined/>}/> : (active_category_id === 4) ? <Avatar  style={{ backgroundColor: '#fd7e14',fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px'}} icon={<ArrowDownOutlined/>}/>  : (active_category_id === 5) ? <Avatar  style={{ fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px'}} /> : (active_category_id === 6) ? <Avatar icon={<MinusOutlined />} style={{ fontSize: '7px' ,top: '-7px',right:'-6px',height:'12px',width:'12px',lineHeight:'12px',backgroundColor:'#dc3545'}} /> : null
        return (
      <>
      <Badge  count={count} />
      <Truncate data={text} length={12} /> </>
       )
      },
      filterDropdown: (
        <Checkbox.Group
        options={partner_active_category_list}
        defaultValue={filter.activecategory}
        onChange={handlePartnerActiveCategory}
        className='filter-drop-down'
      />
      )
    },
    {
      title: 'On Boarded By',
      width: '10%',
      render: (text, record) => <Truncate data={get(record, 'onboarded_by.name', null)} length={12} />
    },
    {
      title: 'Region',
      width: '7%',
      filters: region_list,
      render: (text, record) => get(record, 'city.branch.region.name', '-'),
      filterDropdown: (
        <Checkbox.Group
          options={regions}
          defaultValue={filter.region}
          onChange={handleRegionStatus}
          className='filter-drop-down'
        />
      )

    },
    {
      title: 'Contact No',
      width: '9%',
      render: (text, record) => {
        const number = get(record, 'partner_users[0].mobile', '-')
        return (<Phone number={record.number} text={number} />)
      }

    },
    {
      title: 'Registered At',
      dataIndex: 'created_at',
      width: '10%',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    },
    {
      title: 'Trucks',
      width: '7%',
      render: (text, record) => {
        const truckCount = get(record, 'trucks_aggregate.aggregate.count', '-')
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
      render: (text, record) => get(record, 'partner_status.name', null),
      width: '10%',
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
      width: '12%',
      render: (text, record) => <Truncate data={get(record, 'last_comment.description', '-')} length={12} />
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '9%',
      render: (text, record) => {
        const partner_status = get(record, 'partner_status.name', null)
        return (
          <Space>
            <Tooltip title='Comment'>
              <Button
                type='link'
                icon={<CommentOutlined />}
                onClick={() => handleShow('commentVisible', null, 'partner_id', record.id)}
              />
            </Tooltip>
          </Space>
        )
      }
    }
  ]

  return (
    <>
      <Table
        columns={columnsCurrent}
        dataSource={partners}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1150 }}
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
          footer={null}
        >
          <Comment partner_id={object.partner_id} onHide={handleHide} />
        </Modal>
      )}
      {!loading &&
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          showSizeChanger={false}
          total={record_count}
          onChange={pageChange}
          className='text-right p10'
        />}
    </>
  )
}

export default PartnerKyc
