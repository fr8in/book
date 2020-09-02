import { Modal, Checkbox, Row, Col } from 'antd'
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'

const EMP_LIST = gql`
query employee_list{
  employee{
    id
    email
  }
}
`
const EmployeeListFilter = (props) => {
  const { visible, onHide, onFilterChange, onboarded_by } = props

  const initial = false

  const [checkAll, setCheckAll] = useState(initial)

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
    return { value: data.email, label: data.email }
  })

  const onChange = (checkedValues) => {
    onFilterChange(checkedValues)
    console.log('checked', checkedValues)
  }

  const onCheckall = (e) => {
    setCheckAll(e.target.checked)
    const all_emp = employee.map((data) => data.email)
    onFilterChange(e.target.checked ? all_emp : [])
  }

  return (
    <Modal
      visible={visible}
      onCancel={onHide}
      footer={null}
    >
      <Row>
        <Checkbox onChange={onCheckall} checked={checkAll}>All</Checkbox>
        <Col xs={24} className='emp-list'>
          <Checkbox.Group
            options={employeeList}
            defaultValue={onboarded_by}
            value={onboarded_by}
            onChange={onChange}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default EmployeeListFilter
