
import { Table } from 'antd'
import { gql, useQuery } from '@apollo/client'

const TRUCK_BREAKDOWN_QUERY = gql`
query($truck_status_name:[String!]){
truck(where: {truck_status: {name: {_in: $truck_status_name}}}) {
  id
  truck_no
  partner {
    id
    name
  }
  city {
    id
    name
  }
}
}
`

const Breakdown = (props) => {

 
const {truck_status} = props
  
  const variables = {
    truck_status_name:truck_status
  }

  const { loading, error, data } = useQuery(
    TRUCK_BREAKDOWN_QUERY,
    { variables: variables }
  )

  console.log('Breakdown error', error)

  var truck = []

  if (!loading) {
  truck = data && data.truck
  }

 console.log('truck',truck)

  const columnsCurrent = [
    {
      title: 'Company',
      dataIndex: 'company',
      sorter:true,
      width:'35%',
      render: (text, record) => {
        return record.partner && record.partner.name;
      },
    },
    {
      title: 'Truck',
      dataIndex: 'truck',
      width:'35%',
      render: (text, record) => {
        return record.truck_no
      },
    },
    {
      title: 'City',
      dataIndex: 'city',
      width:'30%',
      render: (text, record) => {
        return record.city && record.city.name;
      },
        
    },
  ]
  return (
      <Table
        columns={columnsCurrent}
        dataSource={truck}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      
      />
  )
}

export default Breakdown
