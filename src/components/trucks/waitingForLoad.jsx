import { Table, Tooltip, Badge, Button, Input, message } from 'antd'
import { CommentOutlined, RocketFilled, SearchOutlined, EditTwoTone, WhatsAppOutlined } from '@ant-design/icons'
import CreatePo from '../trips/createPo'
import PartnerUsers from '../partners/partnerUsers'
import TruckComment from './truckComment'
import CreateBreakdown from './createBreakdown'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import TruckLink from '../common/truckLink'
import Truncate from '../common/truncate'
import Phone from '../common/phone'
import get from 'lodash/get'
import PartnerLink from '../common/PartnerLink'
import CopyToClipboard from "react-copy-to-clipboard";
import { useState } from 'react'
import TrucksList from '../trucks/trucksList'

const WaitingForLoad = (props) => {
  const { trucks, loading, onTruckNoSearch, truckNo ,branches} = props
  const initial = {
    usersData: [],
    usersVisible: false,
    commentData: [],
    commentVisible: false,
    truckId: [],
    poVisible: false,
    editVisible: false,
    editData: [],
    title: '',
    value: '',
    copied: false,
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)
  const [copy, setCopy] = useState(initial)
  const handleTruckNo = (e) => {
    onTruckNoSearch(e.target.value)
  }

  const getMessage = (record) => {
    let message = `${get(record, 'partner.name')} \n`;
    message += `${record.truck_no} - ${get(record, 'truck_type.code')} - ${get(record, 'tat')} hrs\n`;
    message += `O: ${get(record, 'partner.partner_users[0].mobile','-') } / D: ${get(record, 'driver.mobile', '-')} \n`;
    message += `City: ${get(record, 'city.name')} \n`;
    message += `Comment: ${get(record, 'last_comment.description', '-') }`;

    return message;
};

const onCopy = () => {
 setCopy({copied:true})
 message.success('Copied!!')
};

  const columns = [
    {
     title: '',
     width:'1%'
    },
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      width: '14%',
      sorter: (a, b) => (a.truck_no > b.truck_no ? 1 : -1),
      render: (text, record) => {
        const truck_type = get(record,'truck_type.code',null)
        const avg_km =  get(record, 'partner.avg_km', null)
        const avg_km_speed_category_id =  get(record, 'partner.avg_km_speed_category_id', null)
        const count = (avg_km_speed_category_id === 3) ? 'F' : (avg_km_speed_category_id === 4) ? 'S' : (avg_km_speed_category_id === 5) ? 'E' : null
        return (
          <TruckLink
          type='trucks'
            data={text + ' - ' + truck_type.slice(0, 9)}
            id={text}
         avg_km={avg_km}
         count={count}
         avg_km_speed_category_id={avg_km_speed_category_id}
         length={14}
        />
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Truck'
            value={truckNo.truck_no}
            onChange={handleTruckNo}
          />
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Partner',
      width: '10%',
      sorter: (a, b) => (a.partner > b.partner ? 1 : -1),
      render: (text, record) => {
        const id = get(record,'partner.id',null)
        const partner = get(record,'partner.name',null)
        const cardcode = get(record,'partner.cardcode',null)
        const membership_id = get(record,'partner.partner_memberships.membership_type_id',null)
       
        return (
          <span>
            <Badge dot style={{ backgroundColor: (membership_id === 1 ? '#FFD700' : '#C0C0C0') }} />
            <PartnerLink
              id={id}
              type='partners'
              data={partner}
              cardcode={cardcode}
              length={10}
            />
          </span>
        )
      }
    },
    {
      title: 'Partner No',
      width: '10%',
      render: (text, record) => {
        const mobile = get(record,'partner.partner_users[0].mobile',null)
        const partner = get(record,'partner.name',null)
        return (
          <span className='link' onClick={() => handleShow('usersVisible', partner, 'usersData', record.partner)}>{mobile}</span>
        )
      }
    },
    {
      title: 'Driver No',
      width: '10%',
      render: (text, record) => {
        const mobile = get(record, 'driver.mobile',null)
        return (
          <Phone number={mobile} />
        )
      }
    },
    {
      title: 'City',
      width: '12%',
      sorter: (a, b) => (a.city > b.city ? 1 : -1),
      render: (text, record) => {
        const city = get(record,'city.name',null)
        return city
      }
    },
    {
      title: '',
      width: '1',
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
      width: '5%',
      sorter: (a, b) => (a.tat - b.tat),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Comment',
      render: (text, record) => {
        const comment = get(record,'last_comment.description',null)
        return (
          <Truncate data={comment} length={30} />
        )
      },
      width: '18%'
    },
    {
      title: <p>Action {<TrucksList  branches={branches}/>}</p>,
      render: (text, record) => {
        return (
          <span>
            <Tooltip title={get(record, 'driver.mobile',null)}>
              <Phone number={get(record, 'driver.mobile',null)} icon />
            </Tooltip>
            <Tooltip title='Comment'>
              <Button type='link' icon={<CommentOutlined />} onClick={() => handleShow('commentVisible', null, 'commentData', record.id)} />
            </Tooltip>
            <CopyToClipboard text={getMessage(record)} onCopy={onCopy}>
            <Tooltip title='click to copy message'>
              <Button type='link' icon={<WhatsAppOutlined />} />
            </Tooltip>
            </CopyToClipboard>
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
        scroll={{ x: 1256 }}
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

