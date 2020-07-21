import { Modal, Select } from 'antd';
import React from 'react'


const { Option } = Select;
function handleChange(value) {
  console.log(`selected ${value}`);
}

const EmployeeList = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }
    return (
      <div>
             <Modal
              visible={visible}
              onOk={onSubmit}
              onCancel={onHide}
             >
          <Select defaultValue="Owner" style={{ width: 300 }} onChange={handleChange}>
            <Option value="ravi@fr8.in">ravi@fr8.in</Option>
            <Option value="kaviya@fr8.in">kaviya@fr8.in</Option>
            <Option value="sourav@fr8.in">sourav@fr8.in</Option>
            <Option value="tharun@fr8.in">tharun@fr8.in</Option>
          </Select>
        </Modal>
      </div>
    );
  }


export default EmployeeList