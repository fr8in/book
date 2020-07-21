import { Modal, Select } from 'antd';
import React from 'react'
import EmailList from '../../../mock/sourcing/sourcingDetail'

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
          <Select defaultValue="Owner" style={{ width: 300 }} onChange={handleChange} options={EmailList} >
    
          </Select>
        </Modal>
      </div>
    );
  }


export default EmployeeList