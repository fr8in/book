import { Modal, Select,message } from 'antd'
import { gql, useQuery,useMutation } from '@apollo/client'


const PARTNERS_QUERY = gql`
query create_partner{
  employee{
    id
    email
  }
}
`
const UPDATE_OWNER_MUTATION = gql`
mutation update_owner($id:Int,$onboarded_by_id:Int) {
  update_partner(_set: {onboarded_by_id: $onboarded_by_id}, where: {id: {_eq: $id}}) {
    returning {
      id
    }
  }
}
`

const EmployeeList = (props) => {
  const { visible, onHide,partner_id } = props

  const { loading, error, data } = useQuery(
    PARTNERS_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('CreatePartnersContainer error', error)
  const [updateOwner] = useMutation(
    UPDATE_OWNER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
 
  var employee = [];
  if (!loading) {
     employee = data && data.employee
  }
  const employeeList = employee.map((data) => {
    return { value: data.id, label: data.email }
  })
  const onSubmit = (value) => {
    updateOwner({
      variables:{
        id:partner_id,
        onboarded_by_id: value
      }
    })
  }

  return (
    <Modal
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
    >   
      <Select defaultValue='Owner' style={{ width: 300 }} options={employeeList} />
    </Modal>
  )
}

export default EmployeeList
