import { Table, Button } from 'antd'
import Link from 'next/link'
// import mock from '../../../mock/partner/truckByPartner'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import CreatePo from '../trips/createPo'

const list = [
  { value: 1, text: 'All' },
  { value: 2, text: 'Ordered' },
  { value: 3, text: 'Assigned' },
  { value: 4, text: 'confirmed' },
  { value: 5, text: 'Waiting for Loading' },
  { value: 6, text: 'Intransit to Destination' },
  { value: 7, text: 'Waiting for Unloading' },
  { value: 8, text: 'Witing for Load' },
  { value: 9, text: 'Deactivate' },
  { value: 10, text: 'Unloading' }
]
const status = [
  { value: 1, text: 'Express' },
  { value: 2, text: 'Non-Express' }
]
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User',
    name: record.name
  })
}

const PartnerTruck = (props) => {
  const initial = {
    poData: [],
    poVisible: false,
    title: ''
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)
  const { trucks } = props

  const columnsCurrent = [
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      render: (text, record) => {
        return (
          <Link href='/trucks/[id]' as={`/trucks/${record.truck_no}`}>
            <a>{record.truck_no}</a>
          </Link>
        )
      }
    },
    {
      title: 'Truck Type',
      render: (text, record) => {
        return (record.truck_type && record.truck_type.name)
      }

    },
    {
      title: 'Trip ID',
      render: (text, record) => {
        const id = record && record.trips[0] ? record.trips[0].id : null
        return (
          <span>{
            id &&
              <Link href='/trips/[id]' as={`/trips/${id} `}>
                <a>{id}</a>
              </Link>
          }
          </span>
        )
      }
    },
    {
      title: 'Trip',
      render: (text, record) => {
        const id = record && record.trips[0] ? record.trips[0].id : null
        const source = record && record.trips[0] && record.trips[0].source ? record.trips[0].source.name : null
        const destination = record && record.trips[0] && record.trips[0].destination ? record.trips[0].destination.name : null
        const status = record.truck_status &&  record.truck_status.id 
        return (
          <span>{
            id ? 
              <span>
                {source.slice(0, 3) + '-' + destination.slice(0, 3)}
              </span>
              : (status === 1) ? <a type='link' onClick={() => handleShow('poVisible', record.partner, 'poData', record)}>Assign</a> : 'NA'
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
  ]
  return (
    <>
      <Table
        rowSelection={{
          ...rowSelection
        }}
        columns={columnsCurrent}
        dataSource={trucks}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 1050, y: 400 }}
        pagination={false}
      />
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

export default PartnerTruck
