import { Table, Tooltip, Badge, Button, Input } from 'antd'
import Link from 'next/link'
import { PhoneOutlined, CommentOutlined, WhatsAppOutlined, RocketFilled, SearchOutlined } from '@ant-design/icons'
import CreatePo from '../trips/createPo'
import PartnerUsers from '../partners/partnerUsers'
import TripFeedBack from '../trips/tripFeedBack'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'

const WaitingForLoad = (props) => {
  const { trucks, loading } = props
  const initial = {
    usersData: [],
    usersVisible: false,
    commentData: [],
    commentVisible: false,
    poData: [],
    poVisible: false,
    title: ''
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

  const callNow = record => {
    window.location.href = 'tel:' + record
  }

  const columns = [
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      width: '14%',
      sorter: (a, b) => (a.truck_no > b.truck_no ? 1 : -1),
      render: (text, record) => {
        const truck_type = record.truck_type && record.truck_type.name
        return (
          <Link href='/trucks/[id]' as={`/trucks/${text} `}>
            <a>{text + ' - ' + truck_type}</a>
          </Link>
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
      width: '12%',
      sorter: (a, b) => (a.partner > b.partner ? 1 : -1),
      render: (text, record) => {
        const partner = record.partner && record.partner.name
        const noOfLoadsTaken = 1 // TODO
        const partnerEngagementPercent = 30 // TODO
        return (
          <span>
            <Badge dot style={{ backgroundColor: (record.partnerMembershipId === 0 ? '#FFD700' : '#C0C0C0') }} />
            <Link href='/partners/partner/[id]' as={`/partners/partner/${record.partnerId} `}>
              <a>{text && text.length > 20
                ? (
                  <Tooltip title={`${partner}, ${noOfLoadsTaken}, ${partnerEngagementPercent}%`}>
                    <span>{`${partner.slice(0, 20)}...`}</span>
                  </Tooltip>)
                : partner}
              </a>
            </Link>
          </span>
        )
      }
    },
    {
      title: 'Partner No',
      width: '10%',
      render: (text, record) => {
        const mobile = record.partner && record.partner.partner_users && record.partner.partner_users.length > 0 ? record.partner.partner_users[0].mobile : null
        const partner = record.partner && record.partner.name
        const cardcode = record.partner && record.partner.cardcode
        return (
          <span className='link' onClick={() => handleShow('usersVisible', partner, 'usersData', cardcode)}>{mobile}</span>
        )
      }
    },
    {
      title: 'City',
      width: '14%',
      sorter: (a, b) => (a.city > b.city ? 1 : -1),
      render: (text, record) => {
        const city = record.city && record.city.name
        return city
      }
    },
    {
      title: 'TAT',
      dataIndex: 'tat',
      width: '7%',
      sorter: (a, b) => (a.tat > b.tat ? 1 : -1)
    },
    {
      title: 'Comment',
      render: (text, record) => {
        const comment = record.truck_comments && record.truck_comments.length > 0 ? record.truck_comments[0].description : null
        return (
          comment ? <Tooltip title={comment}><span>{comment.slice(0, 12) + '...'}</span></Tooltip>
            : null
        )
      },
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
              <Button type='link' icon={<CommentOutlined />} onClick={() => handleShow('commentVisible', null, 'commentData', record.previousComment)} />
            </Tooltip>
            <Tooltip title='click to copy message'>
              <Button type='link' icon={<WhatsAppOutlined />} />
            </Tooltip>
            <Tooltip title='Quick PO'>
              <Button type='link' icon={<RocketFilled />} onClick={() => handleShow('poVisible', record.partner, 'poData', record)} />
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
        dataSource={trucks}
        className='withAction'
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
        loading={loading}
      />
      {object.usersVisible &&
        <PartnerUsers
          visible={object.usersVisible}
          data={object.usersData}
          onHide={handleHide}
          title={object.title}
        />}

      {object.commentVisible &&
        <TripFeedBack
          visible={object.commentVisible}
          data={object.commentData}
          onHide={handleHide}
        />}

      {object.poVisible &&
        <CreatePo
          visible={object.poVisible}
          data={object.poData}
          onHide={handleHide}
          title={object.title}
        />}
    </>
  )
}

export default WaitingForLoad
