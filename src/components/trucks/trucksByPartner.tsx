import { Table } from 'antd'
import LinkComp from '../common/link'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import { EditTwoTone } from '@ant-design/icons'
import CreatePo from '../trips/createPo'
import { gql, useSubscription } from '@apollo/client'
import CreateBreakdown from '../../components/trucks/createBreakdown'
import get from 'lodash/get'

const PARTNER_TRUCKS_QUERY = gql`
subscription partners_truck($cardcode: String) {
  partner(where: {cardcode: {_eq: $cardcode}}) {
    trucks(where: {truck_status:{name:{_neq: "Rejected"} }}) {
      id
      truck_no
      pan
      loading_memo
      truck_type {
        name
      }
      partner{
        partner_status{
          id
          name
        }
      }
      city {
        name
      }
      truck_status {
        id
        name
      }
      trips(where: {trip_status: {name: {_in: ["Confirmed", "Reported at source", "Intransit", "Reported at destination", "Intransit halting"]}}}) {
        id
        source {
          name
        }
        destination {
          name
        }
      }
    }
  }
}
`

const TrucksByPartner = (props) => {
  const { cardcode } = props
  const initial = {
    truckId: null,
    poVisible: false,
    editVisible: false,
    title: ''
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

  const { loading, error, data } = useSubscription(
    PARTNER_TRUCKS_QUERY,
    {
      variables: {
        cardcode: cardcode
      }
    }
  )

 
  let _data = {}
  if (!loading) {
    _data = data
  }
  const trucks = get(_data, 'partner[0].trucks', [])

  const columnsCurrent = [
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      render: (text, record) => (
        <LinkComp
          type='trucks'
          data={record.truck_no}
          id={record.truck_no}
        />
      )
    },
    {
      title: 'Truck Pan',
      render: (text, record) => {
        return (get(record,'loading_memo') === true ? (record.pan ? record.pan : 'Pan required') : null)
      }

    },
    {
      title: 'Truck Type',
      render: (text, record) => {
        return (record.truck_type && record.truck_type.name)
      }

    },
    {
      title: 'Status',
      render: (text, record) => record.truck_status && record.truck_status.name
    },
    {
      title: 'Trip ID',
      render: (text, record) => {
        const id = record && record.trips[0] ? record.trips[0].id : null
        return (
          <span>{id ? <LinkComp type='trips' data={id} id={id} /> : '-'}</span>
        )
      }
    },
    {
      title: 'Trip',
      render: (text, record) => {
        const id = record && record.trips[0] ? record.trips[0].id : null
        const source = record && record.trips[0] && record.trips[0].source ? record.trips[0].source.name : null
        const destination = record && record.trips[0] && record.trips[0].destination ? record.trips[0].destination.name : null
        const status = record.truck_status && record.truck_status.name
        const partner_status = get(record, 'partner.partner_status.name', null)
        return (
          <span>{
            id ? (
              <span>
                {source.slice(0, 3) + '-' + destination.slice(0, 3)}
              </span>)
              : (status === 'Waiting for Load' && partner_status === 'Active') ? <a type='link' onClick={() => handleShow('poVisible', record.partner, 'truckId', record.id)}>Assign</a>
                : 'NA'
          }
          </span>
        )
      }
    },
    {
      title: 'City',
      render: (text, record) => {
        return (record.city && record.city.name)
      }
    },
    {
      title: '',
      width: '3%',
      render: (text, record) => (
        <EditTwoTone
          onClick={() =>
            handleShow('editVisible', 'Breakdown', 'editData', record.id)}
        />
      )
    }
  ]
  return (
    <>
      <Table
        // rowSelection={{...rowSelection}}
        columns={columnsCurrent}
        dataSource={trucks}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 1050}}
        pagination={false}
      />
      {object.poVisible &&
        <CreatePo
          visible={object.poVisible}
          truck_id={object.truckId}
          onHide={handleHide}
          title={object.title}
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

export default TrucksByPartner
