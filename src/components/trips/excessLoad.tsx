import { Table, Tooltip, Button, Modal, message } from 'antd'
import Link from 'next/link'
import { RocketFilled, DeleteOutlined } from '@ant-design/icons'
import ExcessLoadLead from './excessLoadLead'
import { gql, useSubscription, useMutation } from '@apollo/client'
import _ from 'lodash'
import moment from 'moment'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import ExcessToPo from '../trips/excessToPo'
import userContext from '../../lib/userContaxt'
import {useContext } from 'react'

const EXCESS_LOAD = gql`
subscription excess_loads($regions: [Int!], $branches: [Int!], $cities: [Int!],$trip_status: String, $truck_type:[Int!], $managers: [Int!]) {
  region(where: {id: {_in: $regions}}) {
    id
    name
    branches(where: {id: {_in: $branches}}) {
      id
      name
      connected_cities: cities(where: {_and: [{is_connected_city: {_eq: true}}, {id: {_in: $cities}}]}) {
        id
        name
        cities {
          id
          name
          trips(where: {trip_status: {name: {_eq: $trip_status}}, truck_type:{id: {_in:$truck_type}}, branch_employee_id: {_in: $managers}}) {
            id
            po_date
            source {
              id
              name
            }
            destination {
              id
              name
            }
            truck_type{
              id
              name
            }
            customer {
              id
              cardcode
              name
            }
            customer_price
            is_price_per_ton
            ton
            price_per_ton
            created_at
            leads {
              id
              created_at
              partner {
                id
                cardcode
                name
                partner_users(where: {is_admin: {_eq: true}}) {
                  mobile
                }
                trucks(where: {truck_status:{name:{_eq:"Waiting for Load"}}}){
                  id
                  truck_no
                }
              }
            }
          }
        }
      }
    }
  }
}
`

const CANCEL_LOAD_MUTATION = gql`
mutation cancel_Excess_load($trip_status_id: Int!, $id: Int!,$updated_by: String!){
  update_trip(_set: {trip_status_id: $trip_status_id,updated_by:$updated_by}, where:{id: {_eq: $id}}) {
    returning{
      trip_status_id
    }
  }
}
`
const ExcessLoad = (props) => {
  const { trip_status, filters } = props

  const initial = { cancel_visible: false, po_visible: false, record: null }
  const { object, handleShow, handleHide } = useShowHideWithRecord(initial)
  const context = useContext(userContext)

  const variables = {
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches.length > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities.length > 0) ? filters.cities : null,
    trip_status: trip_status || null,
    truck_type: (filters.types && filters.types.length > 0) ? filters.types : null,
    managers: (filters.managers && filters.managers.length > 0) ? filters.managers : null
  }

  const { loading, data, error } = useSubscription(
    EXCESS_LOAD,
    { variables: variables }
  )

  console.log('Excess Load Error', error)
  let trips = []
  if (!loading) {
    const newData = { data }

    trips = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trips').value()
  }

  const [cancel_load] = useMutation(
    CANCEL_LOAD_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        handleHide()
      }
    }
  )

  const onCancelTrip = (id) => {
    cancel_load({
      variables: {
        id: id,
        trip_status_id: 7,
        updated_by: context.email
      }
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a, b) => (a.id > b.id ? 1 : -1),
      width: '8%',
      render: (text, record) => {
        return (
          <Link href='/trips/[id]' as={`/trips/${record.id} `}>
            <a>{text}</a>
          </Link>)
      }
    },
    {
      title: 'Source',
      width: '14%',
      render: (text, record) => record.source && record.source.name
    },
    {
      title: 'Destination',
      width: '14%',
      render: (text, record) => record.destination && record.destination.name
    },
    {
      title: 'Truck Type',
      width: '14%',
      render: (text, record) => record && record.truck_type && record.truck_type.name
    },
    {
      title: 'Customer Name',
      key: 'customer',
      width: '16%',
      render: (text, record) => {
        const cardcode = record.customer && record.customer.cardcode
        const name = record.customer && record.customer.name
        return (
          <Link href='/customers/[id]' as={`/customers/${cardcode} `}>
            {name && name.length > 12
              ? <Tooltip title={name}><a>{name.slice(0, 12) + '...'}</a></Tooltip>
              : <a>{name}</a>}
          </Link>)
      }
    },
    {
      title: 'S0 Price',
      width: '10%',
      render: (text, record) => record.customer_price
    },
    {
      title: 'Created On',
      dataIndex: 'created_at',
      width: '14%',
      render: (text, record) => moment(text).format('DD-MMM-YY HH:mm')
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          <Tooltip title='Cancel'>
            <Button type='link' danger icon={<DeleteOutlined />} onClick={() => handleShow('cancel_visible', null, 'record', record.id)} />
          </Tooltip>
          {/* <Tooltip title='Double Click to Copy Text'>
            <Button type='link' disabled icon={<CopyOutlined />} onClick={() => console.log('copy')} />
          </Tooltip> */}
          <Tooltip title='Quick Po'>
            <Button type='link' icon={<RocketFilled />} onClick={() => handleShow('po_visible', null, 'record', record)} />
          </Tooltip>
        </span>
      ),
      width: '12%'
    }
  ]
  const expander = trips && trips.length > 0 && trips.filter(data => (data.leads && data.leads.length > 0)).map(data => data.id)
  console.log('expander', expander)
  return (
    <>
      <Table
        columns={columns}
        expandedRowKeys={expander}
        expandedRowRender={record => <ExcessLoadLead record={record} />}
        dataSource={trips}
        className='withAction'
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
        loading={loading}
        expandRowByClick={false}
      />
      {object.cancel_visible &&
        <Modal
          visible={object.cancel_visible}
          title='Cancel Load'
          onCancel={handleHide}
          footer={[
            <Button key='back' onClick={handleHide}>No</Button>,
            <Button key='submit' type='primary' onClick={() => onCancelTrip(object.record)}>Yes</Button>
          ]}
        >
          <p>Load will get cancelled. Do you want to proceed?</p>
        </Modal>}

      {object.po_visible &&
        <ExcessToPo
          visible={object.po_visible}
          record={object.record}
          onHide={handleHide}
        />}
    </>
  )
}

export default ExcessLoad
