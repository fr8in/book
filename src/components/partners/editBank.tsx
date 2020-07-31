import { Modal, Button, Input, Space,Col } from 'antd'
import { LeftOutlined } from '@ant-design/icons'

const EditBank = (props) => {
  const { visible, onHide } = props
  
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
       <Col sm={20}><Input placeholder="Name" /></Col>
       <br />
       <Col sm={20}><Input placeholder="Account Number" /></Col>
       <br />
       <Col sm={20}><Input placeholder="PAN Number" /></Col>    
      </Modal>
    </>
  )
}

export default EditBank