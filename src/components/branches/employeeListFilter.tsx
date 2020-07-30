import { Modal, Checkbox, Row, Col } from 'antd'
import React, { useState } from 'react'
import FilterList from '../../../mock/sourcing/employeeListFilter'

const EmployeeListFilter = (props) => {
  const { visible, onHide } = props
  const usersInitial = { checkedItems: [], visible: false }
  const [checkedItems, setCheckedItems] = useState(usersInitial)

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
          <Checkbox.Group options={FilterList} defaultValue={checkedItems.checkedItems} onChange={onChange} />
        </Col>
      </Row>
    </Modal>
  )
}

export default EmployeeListFilter
