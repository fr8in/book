import { Table, Tooltip, Badge, Button, Input } from 'antd'
import { PhoneOutlined, CommentOutlined, WhatsAppOutlined, RocketFilled, SearchOutlined, EditTwoTone } from '@ant-design/icons'
import CreatePo from '../trips/createPo'
import PartnerUsers from '../partners/partnerUsers'
import TruckComment from '../trucks/truckComment'
import CreateBreakdown from '../../components/trucks/createBreakdown'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import LinkComp from '../common/link'
import Truncate from '../common/truncate'

const WaitingForLoad = (props) => {
  const { trucks, loading, onTruckNoSearch, vars } = props
  const initial = {
    usersData: [],
    usersVisible: false,
    commentData: [],
    commentVisible: false,
    truckId: [],
    poVisible: false,
    editVisible: false,
    editData: [],
    title: ''
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

  const callNow = record => {
    window.location.href = 'tel:' + record
  }

  const handleTruckNo = (e) => {
    onTruckNoSearch(e.target.value)
  }

  const columns = [
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      width: '15%',
      sorter: (a, b) => (a.truck_no > b.truck_no ? 1 : -1),
      render: (text, record) => {
        const truck_type = record.truck_type && record.truck_type.name
        return (
          <LinkComp
            type='trucks'
            data={text + ' - ' + truck_type.slice(0, 9)}
            id={text}
          />
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Truck'
            id='truck'
            name='truck'
            value={vars && vars.truck_no}
            onChange={handleTruckNo}
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Partner',
      width: '14%',
      sorter: (a, b) => (a.partner > b.partner ? 1 : -1),
      render: (text, record) => {
        const partner = record.partner && record.partner.name
        const noOfLoadsTaken = 1 // TODO
        const partnerEngagementPercent = 30 // TODO
        const membership_id = record.partner && record.partner.partner_memberships && record.partner.partner_memberships.membership_type_id
        return (
          <span>
            <Badge dot style={{ backgroundColor: (membership_id === 1 ? '#FFD700' : '#C0C0C0') }} />
            <LinkComp
              type='partners'
              data={partner}
              id={record.partner && record.partner.cardcode}
              length={18}
            />
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
        return (
          <span className='link' onClick={() => handleShow('usersVisible', partner, 'usersData', record.partner)}>{mobile}</span>
        )
      }
    },
    {
      title: 'City',
      width: '12%',
      sorter: (a, b) => (a.city > b.city ? 1 : -1),
      render: (text, record) => {
        const city = record.city && record.city.name
        return city
      }
    },
    {
      title: '',
      render: (text, record) => (
        <EditTwoTone
          onClick={() =>
            handleShow('editVisible', 'Breakdown', 'editData', record.id)}
        />
      )
    },
    {
      title: 'TAT',
      dataIndex: 'tat',
      width: '6%',
      sorter: (a, b) => (a.tat > b.tat ? 1 : -1)
    },
    {
      title: 'Comment',
      render: (text, record) => {
        const comment = record.last_comment && record.last_comment.description 
        return (
          <Truncate data={comment} length={30} />
        )
      },
      width: '27%'
    },
    {
      title: 'Action',
      render: (text, record) => {
        return (
          <span>
            <Tooltip title={record.driver && record.driver.mobile}>
              <Button type='link' icon={<PhoneOutlined />} onClick={() => callNow(record.driver && record.driver.mobile)} />
            </Tooltip>
            <Tooltip title='Comment'>
              <Button type='link' icon={<CommentOutlined />} onClick={() => handleShow('commentVisible', null, 'commentData', record.id)} />
            </Tooltip>
            {/* <Tooltip title='click to copy message'>
              <Button type='link' icon={<WhatsAppOutlined />} />
            </Tooltip> */}
            <Tooltip title='Quick PO'>
              <Button type='link' icon={<RocketFilled />} onClick={() => handleShow('poVisible', record, 'truckId', record.id)} />
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
          partner={object.usersData}
          onHide={handleHide}
          title={object.title}
        />}

      {object.commentVisible &&
        <TruckComment
          visible={object.commentVisible}
          id={object.commentData}
          onHide={handleHide}
        />}

      {object.poVisible &&
        <CreatePo
          visible={object.poVisible}
          truck_id={object.truckId}
          onHide={handleHide}
        />}

      {object.editVisible && (
        <CreateBreakdown
          visible={object.editVisible}
          id={object.editData}
          onHide={handleHide}
          title={object.title}
        />
      )}
    </>
  )
}

export default WaitingForLoad
