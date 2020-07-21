import { Modal,Checkbox,Row,Col } from 'antd';
import React from 'react'
import FilterList from '../../../mock/sourcing/employeeListFilter'
function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  const EmployeeListFilter = (props) => {
    const { visible, onHide } = props
  
    // function onChange(checkedValues) {
    //   setCheckedItems(checkedValues);
    // }
    return (
      <div>
        <Modal
              visible={visible}
              onCancel={onHide}
             >
              <Col> 
        <Row>  
        <Checkbox.Group options={FilterList}  onChange={onChange} /> 
        </Row>
        </Col>
        </Modal>
      </div>
    );
  }

export default EmployeeListFilter 