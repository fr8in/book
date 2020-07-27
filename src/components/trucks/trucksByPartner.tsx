import { Table, Button } from 'antd'
import Link from 'next/link'
//import mock from '../../../mock/partner/truckByPartner'

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
  const { trucks } = props
 
  const columnsCurrent = [
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      render: (text, record) => {
        return (
          <Link href='/trucks/[id]' as={`/trucks/${record.truck_no}`}>
            <a>{ record.truck_no}</a>
          </Link>
        )
      }
    },
    {
      title: 'Truck Type',
      render:(text,record)=>{
        return( record.truck_type && record.truck_type.value)
      },

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
      render:(text,record)=>{
        const id = record && record.trips[0] ? record.trips[0].id : null
        const source = record && record.trips[0] && record.trips[0].source ? record.trips[0].source.name : null
        const destination = record && record.trips[0] && record.trips[0].destination ? record.trips[0].destination.name : null
        return( 
          <span>{
            id ?  
            <span>
              {
                source.slice(0,3)+ '-' + destination.slice(0,3)
              }
            </span>: (record.trucks_status.value === 7 || record.trucks_status.value === 8 || record.trucks_status.value === 11 ) ? 'NA' :
            <Button type='link'>Assign</Button>        
            }
            </span>
        )
     }
    },
    {
      title: 'City',
      render:(text,record)=>{
        return( record.city && record.city.name)
      },

    },
    {
      title: 'Status',
      render:(text,record)=>{
        return(record.truck_status && record.truck_status.value)
      },
      filters: list
    },
    {
      title: 'Avg Km/day',
      dataIndex: 'averageKm',
      sorter: (a, b) => (a.averageKm > b.averageKm ? 1 : -1),
      filters: status
    }
  ]
  return (
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
  )
}

export default PartnerTruck
