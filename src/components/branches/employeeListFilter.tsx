import { Modal, Checkbox, Row, Col, Tag } from 'antd'
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

const EMPLOYEE_LIST = gql`
query Employee {
  employee(where: {employee_roles: {role: {name: {_eq: "Sourcing"}}}}) {
    id
    email
    onboardedbyPartners_aggregate(where: {partner_status: {name: {_eq: "Lead"}}}) {
      aggregate {
        count
      }
    }
  }
}           
`
const EmployeeListFilter = (props) => {
  const { visible, onHide, onFilterChange, onboarded_by } = props

  const initial = false

  const [checkAll, setCheckAll] = useState(initial)

  const { loading, error, data } = useQuery(
    EMPLOYEE_LIST,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )


  var employee = []
  if (!loading) {
    employee = get(data,'employee',null)
  }
 
  const employeeList = employee.map((data) => {
    return { value: data.email , label: <span> {data.email} <Tag color='#40a9ff'>{data.onboardedbyPartners_aggregate.aggregate.count}</Tag></span>}
  })

  const onChange = (checkedValues) => {
    onFilterChange(checkedValues)
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
