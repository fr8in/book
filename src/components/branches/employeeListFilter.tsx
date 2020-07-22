import { Modal,Checkbox,Row,Col } from 'antd'
import React,{useState} from 'react'
import FilterList from '../../../mock/sourcing/employeeListFilter'

  const EmployeeListFilter = (props) => {
    const { visible, onHide } = props
    const usersInitial = { checkedItems:[] }
    const [checkedItems, setCheckedItems] = useState(usersInitial)

    function onChange(checkedValues) {
    setCheckedItems(checkedValues);
    }
    return (
      <div>
        <Modal
          visible={visible}
          onCancel={onHide}
          footer={null}
             >
         <Row>
         <Col xs={24} className='emp-list'>
           <Checkbox.Group options={FilterList} defaultValue= {['checkedItems']} onChange={onChange} /> 
        </Col>
        </Row>
        <br />
        </Modal>
      </div>
    );
  }

export default EmployeeListFilter 