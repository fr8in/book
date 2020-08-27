import { Modal, Checkbox, Row, Col } from 'antd'
import React, { useState } from 'react'
import { gql, useQuery} from '@apollo/client'

const EMP_LIST = gql`
query employee_list{
  employee{
    id
    email
  }
}
`
const EmployeeListFilter = (props) => {
  const { visible, onHide} = props
  const usersInitial = { checkedItems: [], visible: false }
  const [checkedItems, setCheckedItems] = useState(usersInitial)

  const auth_user = ['jay@fr8.in']
  
  const { loading, error, data } = useQuery(
    EMP_LIST,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('CreatePartnersContainer error', error)


  var employee = []
  if (!loading) {
    employee = data && data.employee
  }
  const employeeList = employee.map((data) => {
    return { value: data.id, label: data.email }
  })
  
  const onChange = (checkedValues) => {
    setCheckedItems(checkedValues)
  }
  return (
    <Modal
      visible={visible}
      onCancel={onHide}
      footer={null}
    >
      <Row>
        <Checkbox>All</Checkbox>
        <Col xs={24} className='emp-list'>
          <Checkbox.Group options={employeeList} defaultValue={auth_user} onChange={onChange}  />
        </Col>
      </Row>
    </Modal>
  )
}

export default EmployeeListFilter
