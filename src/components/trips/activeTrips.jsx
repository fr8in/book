import { Table, Tooltip, Button, Popconfirm, message } from 'antd'
import { CommentOutlined, CheckOutlined } from '@ant-design/icons'
import moment from 'moment'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import TripFeedBack from './tripFeedBack'
import Truncate from '../common/truncate'
import get from 'lodash/get'
import LinkComp from '../common/link'
import Phone from '../common/phone'
import { gql, useMutation } from '@apollo/client'

const ASSIGN_TO_CONFIRM_STATUS_MUTATION = gql`
mutation update_trip_status($id: Int , $trip_status_id : Int) {
  update_trip(_set: {trip_status_id: $trip_status_id}, where: {id: {_eq: $id}}) {
    returning {
      id
    }
  }
}
`

const Trips = (props) => {
  const { trips, loading } = props
  const initial = {
    commentData: [],
    commentVisible: false
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

  const [assign_to_confirm] = useMutation(
    ASSIGN_TO_CONFIRM_STATUS_MUTATION, {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
      }
    })
  const onSubmit = (id) => {
    assign_to_confirm({
      variables: {
        trip_status_id: 3,
        id: id
      }
    })
  }

  const tat = {
    Assigned: (record) => record.confirmed_tat,
    Confirmed: (record) => record.confirmed_tat,
    'Reported at source': (record) => record.loading_tat,
    Intransit: (record) => record.intransit_tat,
    'Intransit halting': (record) => record.intransit_tat,
    'Reported at destination': (record) => record.unloading_tat
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <LinkComp
            type='trips'
            data={text}
            id={record.id}
            blank
          />)
      },
      sorter: (a, b) => a.id - b.id,
      width: '7%'
    },
    {
      title: 'Customer',
      render: (text, record) => {
        const cardcode = get(record, 'customer.cardcode', null)
        const name = get(record, 'customer.name', null)
        return (
          <LinkComp
            type='customers'
            data={name}
            id={cardcode}
            length={12}
            blank
          />)
      },
      sorter: (a, b) => (a.customer.name > b.customer.name ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Partner',
      render: (text, record) => {
        const cardcode = get(record, 'partner.cardcode', null)
        const name = get(record, 'partner.name', null)
        return (
          <LinkComp
            type='partners'
            data={name}
            id={cardcode}
            length={10}
            blank
          />)
      },
      sorter: (a, b) => (a.partner.name > b.partner.name ? 1 : -1),
      width: '10%'
    },
    {
      title: 'Driver No',
      render: (text, record) => {
        const mobile = get(record, 'driver.mobile', null)
        return (
          mobile ? <Phone number={mobile} />: null
        )
      },
      width: props.intransit ? '10%' : '11%'
    },
    {
      title: 'Truck',
      render: (text, record) => {
        const truck_no = get(record, 'truck.truck_no', null)
        const truck_type_name = get(record, 'truck.truck_type.name', null)
        const truck_type = truck_type_name ? truck_type_name.slice(0, 9) : null
        return (
          <LinkComp
            type='trucks'
            data={truck_no + ' - ' + truck_type}
            id={truck_no}
            blank
          />)
      },
      width: '16%'
    },
    {
      title: 'Source',
      render: (text, record) => {
        const source = get(record, 'source.name', null)
        return <Truncate data={source} length={10} />
      },
      sorter: (a, b) => (a.source.name > b.source.name ? 1 : -1),
      width: '7%'
    },
    {
      title: 'Destination',
      render: (text, record) => {
        const destination = get(record, 'destination.name', null)
        return <Truncate data={destination} length={10} />
      },
      sorter: (a, b) => (a.destination.name > b.destination.name ? 1 : -1),
      width: '7%'
    },
    {
      title: 'TAT',
      render: (text, record) => {
        const status = get(record, 'trip_status.name', null)
        return tat[status](record)
      },
      sorter: (a, b) => {
        const status = get(a, 'trip_status.name', null)
        return tat[status](a) > tat[status](b) ? 1 : -1
      },
      defaultSortOrder: 'descend',
      width: '4%'
    },
    props.intransit ? {
      title: 'Delay',
      dataIndex: 'delay',
      width: '5%',
      sorter: (a, b) => (a.delay > b.delay ? 1 : -1)
    } : {},
    props.intransit ? {
      title: 'ETA',
      dataIndex: 'eta',
      width: '6%',
      sorter: (a, b) => (a.eta > b.eta ? 1 : -1),
      render: (text, record) => text ? moment(text).format('DD-MMM') : null
    } : {},
    {
      title: 'Comment',
      render: (text, record) => {
        const comment = get(record, 'last_comment.description', null)
        return <Truncate data={comment} length={26} />
      },
      width: props.intransit ? '9%' : '17%'
    },
    {
      title: 'Action',
      render: (text, record) => {
        const is_execption = get(record, 'customer.is_exception', null)
        const expection_date = get(record, 'customer.exception_date', null)
        const assign_status = get(record, 'trip_status.name', null)
        const expection_dates = expection_date ? moment(expection_date).format('YYYY-MM-DD') : null
        const todayDate = new Date().toISOString().slice(0, 10)
        return (
          <span>
            <Tooltip title={record.driverPhoneNo}>
            <Phone number={record.driverPhoneNo} />
            </Tooltip>
            <Tooltip title='Comment'>
              <Button type='link' icon={<CommentOutlined />} onClick={() => handleShow('commentVisible', null, 'commentData', record.id)} />
            </Tooltip>
            {/* <Tooltip title='click to copy message'>
            <Button type='link' icon={<WhatsAppOutlined />} />
          </Tooltip> */}
            <>
              {
                assign_status === 'Assigned'
                  ? <Popconfirm
                    title='Are you sure you want to change this status to confirmed?'
                    okText='Yes'
                    cancelText='No'
                    onConfirm={() => onSubmit(record.id)}
                  >
                    <Button
                      icon={<CheckOutlined />}
                      type='primary'
                      size='small'
                      shape='circle'
                      disabled={is_execption && (expection_dates < todayDate || expection_dates === null)}
                    />
                  </Popconfirm> : null
              }
            </>
          </span>
        )
      },

      width: props.intransit ? '9%' : '11%'
    }
  ]
  return (
    <>
      <Table
        columns={columns}
        dataSource={trips}
        className='withAction'
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 1256 }}
        pagination={false}
        loading={loading}
      />
      {object.commentVisible &&
        <TripFeedBack
          visible={object.commentVisible}
          tripid={object.commentData}
          onHide={handleHide}
        />}
    </>
  )
}

export default Trips
