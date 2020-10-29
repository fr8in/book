import { Modal, Checkbox, Row, Col, Tag } from 'antd'
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

const EMP_LIST = gql`
query Employee {
  employee(where: {onboardedbyPartners: {id: {_is_null: false}, partner_status_id: {_in: [2, 3, 8]}}}) {
    id
    email
   onboardedbyPartners_aggregate {
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
    EMP_LIST,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('CreatePartnersContainer error', error)

  var employee = []
  if (!loading) {
    employee = get(data,'employee',null)
  }
 
  const employeeList = employee.map((data) => {
    return { value:data.onboardedbyPartners_aggregate.aggregate.count &&data.email , label: <span> {data.email} <Tag color='#40a9ff'>{data.onboardedbyPartners_aggregate.aggregate.count}</Tag></span>}
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
