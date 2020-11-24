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


const CUSTOMER_SUBCRIPTION = gql`
subscription trip($customer_id: Int) {
  trip(where: {customer_id: {_eq: $customer_id}, trip_status: {name: {_eq: "Assigned"}}}) {
    id
    partner {
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
      }
    }
  }
}
`
const ASSIGN_TO_CONFIRM_STATUS_MUTATION = gql`
mutation customer_exception($trip_id:[Int!],$description: String, $topic: String, $created_by: String, $exception_date: timestamp, $customer_id: Int, $updated_by: String!) {
  update_customer(_set: {exception_date: $exception_date, updated_by: $updated_by}, where: {id: {_eq: $customer_id}}) {
    returning {
      id
      name
      managed
    }
  }
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


const CustomerExceptionDate = (props) => {
  const { exceptionDate, cardcode, edit_access, customer_id, id } = props
  const context = useContext(userContext)
  const { topic } = u
  const initial = { datePicker: false }
  const { visible, onHide, onShow } = useShowHide(initial)

  const [selectedTrip, setSelectedTrip] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    const trip_list = selectedRows && selectedRows.length > 0 ? selectedRows.map(row => row.id) : []
    setSelectedRowKeys(selectedRowKeys)
    setSelectedTrip(trip_list)
  }

  const rowSelection =  {
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
    console.log('trip_ids', trip_ids)
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

  
  const onSubmit = (form) => {
    assign_to_confirm({
      variables: {
        customer_id: id,
        trip_id: selectedTrip,
        updated_by: context.email,
        created_by: context.email,
        description: `${topic.customer_exception} updated by ${context.email}`,
        topic: topic.customer_exception,
        exception_date: form.exception_date.format('YYYY-MM-DD')
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
            blank
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
          <LinkComp
            type='partners'
            data={name}
            id={cardcode}
            length={7}
            blank
          />)
      }
    },
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      width: '25%',
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
    <div>
      {!visible.datePicker ? (
        <label>
          {exceptionDate ? moment(exceptionDate).format(dateFormat) : '-'}{' '}
          <EditAccess edit_access={edit_access} onEdit={() => onShow('datePicker')} />
        </label>)
        : (
          <span>
            <Modal
              title='Customer Confirmation'
              visible={visible}
              onCancel={onHide}
              style={{ top: 20 }}
              width={700}
              footer={null}
            >
              <Form layout='vertical' onFinish={onSubmit}>
                <Form.Item label='Exception Date' name='exception_date'>
                  <DatePicker
                    showToday={false}
                    placeholder='Exception Date'
                    defaultValue={exceptionDate ? moment(exceptionDate, dateFormat) : null}
                    format={dateFormat}
                    size='middle'
                  />
                </Form.Item>
                <p>Below trips will change to confirm status</p>
                <Table
                  columns={columns}
                  dataSource={trips}
                  rowKey={(record) => record.id}
                  size='small'
                  rowSelection={{ ...rowSelection }}
                  scroll={{ x: 620, y: 250 }}
                  pagination={false}
                  className='withAction'
                />
                <br />
                <Row justify='end'>
                  <Form.Item>
                    <Button type='primary' key='submit' htmlType='submit'>Ok</Button>
                  </Form.Item>
                </Row>
              </Form>

            </Modal>
          </span>)}
    </div>
  )
}

export default CustomerExceptionDate
