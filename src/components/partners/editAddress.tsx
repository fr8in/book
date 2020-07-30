import { Modal, Button, Input,Select,Col } from 'antd'
import { LeftOutlined } from '@ant-design/icons'

const { Option } = Select;
const EditAddress = (props) => {
  const { visible, onHide } = props
  
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <>
      <Modal
        title='Edit Bank'
        visible={visible}
        onCancel={onHide}
        footer={[
          <Button type='primary'icon={<LeftOutlined/>} > Back </Button>,
          <Button  type='primary'> Save </Button>
        ]}
      >
          <Col sm={20}><Input placeholder="Building Number" /></Col>
          <br />
          <Col sm={20}><Input placeholder="Address" /></Col>
          <br />
          <Col sm={20}> <Select defaultValue="Place" style={{ width: 380 }} onChange={handleChange}></Select> </Col>
          <br />
          
          <Col sm={20}> <Select defaultValue="Place" style={{ width: 380 }}  onChange={handleChange}></Select> </Col>
          
          <br />
          <Col sm={20}> <Input placeholder="Value" /> </Col>
      </Modal>
    </>
  )
}

export default EditAddress