import { Modal, Button , Row, Col , DatePicker, Select, Space, Input} from 'antd';
import React from 'react'


const { Option } = Select;
const { TextArea } = Input;

function handleChange(value) {
    console.log(`selected ${value}`);
  }

  const EditModal = (props) => {
    const { visible, onHide } = props

    const onSubmit = () => {
      console.log('data Transfered!')
      onHide()
    }

    return (
      <> 
       <Modal
      title="Add BreakDown or In-transit Halting"
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      footer={[
        <Button type="primary"> Save </Button>
       ]}
      > 
        <Row>
            <Space>
      <Col >
      <p>Available Date</p>
      </Col>
      <Col >
      <p> Current City:</p>
      </Col>
      </Space>
        </Row>
        <Row>
            <Space>
            <Col>
            <DatePicker
                                showTime
                                name="selectSearchDate"
                                format="YYYY-MM-DD"
                                className="selectSearchdate1"
                                placeholder="Select Date"/>
        
            </Col>
            <Col>
            <Select defaultValue="Chennai" style={{ width: 120 }} onChange={handleChange}>
      <Option value="Coimbatore">Coimbatore</Option>
      <Option value="Madurai">Madurai</Option>
      <Option value="Trichy">Trichy</Option>
      </Select>
            </Col>
            </Space>
        </Row>
        <br/>
        <TextArea
          placeholder="Enter Comment"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
        </Modal>
      </>
    );
  }


export default EditModal;