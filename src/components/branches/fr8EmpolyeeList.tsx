import { Modal, Select } from 'antd'
import EmailList from '../../../mock/sourcing/employeeList'
import { gql, useQuery } from '@apollo/client'


const PARTNERS_QUERY = gql`
query create_partner{
  employee{
    id
    email
  }
}
`

const EmployeeList = (props) => {
  const { visible, onHide } = props

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }
  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }

  const { loading, error, data } = useQuery(
    PARTNERS_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('CreatePartnersContainer error', error)
  var employee = [];
  if (!loading) {
     employee = data && data.employee
  }
  const employeeList = employee.map((data) => {
    return { value: data.email, label: data.email }
  })

  return (
    <Modal
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
    >
      <Select defaultValue='Owner' style={{ width: 300 }} onChange={handleChange} options={employeeList} />
    </Modal>
  )
}

export default EmployeeList
