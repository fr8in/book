import { Modal, Button, Row, Col, Form, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons'


const CheckBoxModal = (props) => {
  const { visible, onHide } = props

  return (
    <>
      <Modal
        title="Unloaded at private godown"
        visible={visible}
        onCancel={onHide}
        footer={[
          <Button key="back" >
            Cancel
          </Button>,
          <Button key="Update" type="primary">
            Save
          </Button>,
        ]}
      >
        <Form layout='vertical'>
          <Row gutter={10}>

            <Col sm={20}>
              <Form.Item
                label="Godown Receipt"
                name="Godown Receipt"
                rules={[{ required: true }]}
              >
                <Button>
                  <UploadOutlined />
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={20}>
              <Form.Item
                label="Building Number"
                name="Building Number"
                rules={[{ required: true, message: 'Building Number is required field!' }]}
              >
                <Input placeholder="Building Number" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={20}>
              <Form.Item
                label="Address"
                name="Address"
                rules={[{ required: true, message: 'Address is required field!' }]}
              >
                <Input placeholder="Address" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={20}>
              <Form.Item
                label="Pin Code"
                name="Pin Code"
                rules={[{ required: true, message: 'Pin Code is required field!' }]}
              >
                <Input placeholder="Pin Code" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={20}>
              <Form.Item
                label="City"
                name="City"
                rules={[{ required: true, message: 'City is required field!' }]}
              >
                <Input placeholder="City" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={20}>
              <Form.Item
                label="State"
                name="State"
                rules={[{ required: true, message: 'State is required field!' }]}
              >
                <Input placeholder="State" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}


export default CheckBoxModal;