import { Modal,Checkbox,Row } from 'antd';
import React from 'react'

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  const EmployeeListFilter = (props) => {
    const { visible, onHide } = props
  

    return (
      <div>
        <Modal
              visible={visible}
              onCancel={onHide}
             >
        <Row>  
        <Checkbox onChange={onChange}>All</Checkbox>
        </Row>
        <Row>
        <Checkbox onChange={onChange}>jay@fr8.in</Checkbox>
        </Row>
        </Modal>
      </div>
    );
  }

export default EmployeeListFilter 