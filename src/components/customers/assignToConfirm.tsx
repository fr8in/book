import { message, DatePicker, Modal, Table, Row, Form, Space, Button, } from 'antd'
import moment from 'moment'
import { gql, useMutation, useSubscription } from '@apollo/client'
import useShowHide from '../../hooks/useShowHide'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'
import u from '../../lib/util'
import EditAccess from '../common/editAccess'
import get from 'lodash/get'
import LinkComp from '../common/link'
import Phone from '../common/phone'
import Truncate from '../common/truncate'
import { useState, useEffect } from 'react'
import Loading from '../common/loading'
import PartnerLink from '../common/PartnerLink'

const CUSTOMER_SUBCRIPTION = gql`
subscription trip($customer_id: Int) {
  trip(where: {customer_id: {_eq: $customer_id}, trip_status: {name: {_eq: "Assigned"}}}) {
    id
    partner {
      id
      name
      cardcode
    }
    source {
      name
    }
    destination {
      name
    }
    driver {
      mobile
    }
    truck {
      truck_no
      truck_type {
        name
        code
      }
    }
  }
}
`
const ASSIGN_TO_CONFIRM_STATUS_MUTATION = gql`
mutation customer_exception($trip_id: [Int!], $description: String, $topic: String, $created_by: String, $customer_id: Int) {
  update_trip(where: {customer_id: {_eq: $customer_id}, trip_status: {name: {_eq: "Assigned"}}, id: {_in: $trip_id}}, _set: {trip_status_id: 3}) {
    returning {
      id
    }
  }
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
}
`


const AssignToConfirm = (props) => {
  const { onHide, id, visible } = props
  const context = useContext(userContext)
  const { topic } = u


  const [selectedTrip, setSelectedTrip] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    const trip_list = selectedRows && selectedRows.length > 0 ? selectedRows.map(row => row.id) : []
    setSelectedRowKeys(selectedRowKeys)
    setSelectedTrip(trip_list)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const { loading, error, data } = useSubscription(
    CUSTOMER_SUBCRIPTION,
    {
      variables: { customer_id: id }
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
  const trips = get(_data, 'trip', [])

  useEffect(() => {
    const trip_ids = trips.map(trip => trip.id)
    setSelectedRowKeys(trip_ids)
    setSelectedTrip(trip_ids)
  }, [loading])


  const [assign_to_confirm] = useMutation(
    ASSIGN_TO_CONFIRM_STATUS_MUTATION, {
    onError(error) {
      message.error(error.toString())
    },
    onCompleted() {
      message.success('Updated!!')
    }
  })


  const onSubmit = () => {
    assign_to_confirm({
      variables: {
        customer_id: id,
        trip_id: selectedTrip,
        created_by: context.email,
        description: `${topic.customer_exception} updated by ${context.email}`,
        topic: topic.customer_exception
      }
    })
    onHide()
  }

  const dateFormat = 'YYYY-MM-DD'

  const columns = [
    {
      title: 'Trip ID',
      dataIndex: 'id',
      width: '11%',
      render: (text, record) => {
        return (
          <LinkComp
            type='trips'
            data={text}
            id={record.id}
          />
        )
      }
    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      width: '16%',
      render: (text, record) => {
        const cardcode = get(record, 'partner.cardcode', null)
        const name = get(record, 'partner.name', null)
        return (
          <PartnerLink
            type='partners'
            data={name}
            cardcode={cardcode}
            id={id}
            length={7}
          />)
      }
    },
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      width: '25%',
      render: (text, record) => {
        const truck_no = get(record, 'truck.truck_no', null)
        const truck_type_name = get(record, 'truck.truck_type.code', null)
        const truck_type = truck_type_name ? truck_type_name.slice(0, 9) : null
        return (
          <LinkComp
            type='trucks'
            data={truck_no + ' - ' + truck_type}
            id={truck_no}
            length={16}
          />)
      }
    },
    {
      title: 'Driver No',
      dataIndex: 'mobile',
      width: '16%',
      render: (text, record) => {
        const mobile = get(record, 'driver.mobile', null)
        return (
          mobile ? <Phone number={mobile} /> : null
        )
      }
    },
    {
      title: 'Source',
      dataIndex: 'source',
      width: '16%',
      render: (text, record) => {
        const source = get(record, 'source.name', null)
        return <Truncate data={source} length={7} />
      }
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      width: '16%',
      render: (text, record) => {
        const destination = get(record, 'destination.name', null)
        return <Truncate data={destination} length={7} />
      }
    }
  ]

  return (
    <Modal
      title='Customer Confirmation'
      visible={visible}
      onCancel={onHide}
      onOk={onSubmit}
      style={{ top: 20 }}
      width={700}
    >
      { loading ? <Loading /> : (
        <Table
          columns={columns}
          dataSource={trips}
          rowKey={(record) => record.id}
          size='small'
          rowSelection={{ ...rowSelection }}
          scroll={{ x: 620, y: 250 }}
          pagination={false}
          className='withAction'
        />)}
    </Modal>
  )
}

export default AssignToConfirm
