import { useState } from 'react'
import loadData from '../../../mock/trucks/loadData'
import { Table, Tooltip, Badge, Button, Input } from 'antd'
import Link from 'next/link'
import { PhoneOutlined, CommentOutlined, WhatsAppOutlined, RocketFilled, SearchOutlined } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import CustomerPo from '../customers/customerPo'
import PartnerUsers from '../partners/partnerUsers'
import TripFeedBack from '../trips/tripFeedBack'

const WaitingForLoad = () => {
  const initial = { comment: false, truckSearch: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const usersInitial = { users: [], name: '', visible: false }
  const [users, setUsers] = useState(usersInitial)

  const Initial ={previousComment: [],visible:false}
  const [previousComment,setPreviousComment] =useState(Initial)

  const callNow = record => {
    window.location.href = 'tel:' + record
  }

  const usersClose = () => {
    setUsers(usersInitial)
  }

  const showUsers = (record) => {
    setUsers({ ...users, users: record.users, name: record.partner, visible: true })
  }
 
  const previousCommentClose = () => {
    setPreviousComment(Initial)
  }
  const showPreviousComment = (record) => {
    setPreviousComment({ ...previousComment, previousComment: record, visible: true })
  }

  const columns = [
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
      width: '14%',
      sorter: (a, b) => (a.truckNo > b.truckNo ? 1 : -1),
      className: 'pl10',
      render: (text, record) => {
        return (
          <span>
            {record.statusId === 7 &&
              <Badge dot style={{ backgroundColor: ('#007dfe') }} />}
            <Link href='/trucks/truck/[id]' as={`/trucks/truck/${record.id} `}>
              <a>{text}</a>
            </Link>
          </span>
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Truck'
            id='truck'
            name='truck'
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      width: '12%',
      sorter: (a, b) => (a.partner > b.partner ? 1 : -1),
      render: (text, record) => {
        return (
          <span>
            <Badge dot style={{ backgroundColor: (record.partnerMembershipId === 0 ? '#FFD700' : '#C0C0C0') }} />
            <Link href='/partners/partner/[id]' as={`/partners/partner/${record.partnerId} `}>
              <a>{text && text.length > 20
                ? (
                  <Tooltip title={`${text}, ${record.noOfLoadsTaken}, ${record.partnerEngagementPercent}%`}>
                    <span>{`${text.slice(0, 20)}...`}</span>
                  </Tooltip>)
                : text}
              </a>
            </Link>
          </span>
        )
      }
    },
    {
      title: 'Partner No',
      dataIndex: 'partnerNo',
      width: '10%',
      render: (text, record) => {
        return (
          <span className='link' onClick={() => showUsers(record)}>{text}</span>
        )
      }
    },
    {
      title: 'City',
      dataIndex: 'city',
      width: '14%',
      sorter: (a, b) => (a.city > b.city ? 1 : -1)
    },
    {
      title: 'TAT',
      dataIndex: 'tat',
      width: '7%',
      sorter: (a, b) => (a.tat > b.tat ? 1 : -1)
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      width: '27%'
    },
    {
      title: 'Action',
      render: (text, record) => {
        return (
          <span>
            <Tooltip title={record.driverPhoneNo}>
              <Button type='link' icon={<PhoneOutlined />} onClick={() => callNow(record.driverPhoneNo)} />
            </Tooltip>
            <Tooltip title='Comment'>
              <Button type='link' icon={<CommentOutlined />} onClick={() => showPreviousComment(record.previousComment)} />
            </Tooltip>
            <Tooltip title='click to copy message'>
              <Button type='link' icon={<WhatsAppOutlined />} />
            </Tooltip>
            <Tooltip title='Quick PO'>
              <Button type='link' icon={<RocketFilled />} onClick={() => onShow('poModal')} />
            </Tooltip>
          </span>
        )
      },
      width: '12%'
    }
  ]
  return (
    <>
      <Table
        columns={columns}
        dataSource={loadData}
        className='withAction'
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
      />
      {users.visible &&
        <PartnerUsers
          visible={users.visible}
          data={users.users}
          onHide={usersClose}
          name={users.name}
        />}
         
      {previousComment.visible &&
        <TripFeedBack
          visible={previousComment.visible}
          data={previousComment.previousComment}
          onHide={previousCommentClose}
        />}
      {visible.poModal && <CustomerPo visible={visible.poModal} onHide={() => onHide('poModal')} />}
    </>
  )
}

export default WaitingForLoad
