import { Modal, Button, Row, Col, Form, Input,message } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'

const PRIVATE_GODWON_MUTATION = gql`
mutation updatePrivateGodown($id: Int!, $private_godown_address: jsonb) {
  update_trip(_set: {private_godown_address: $private_godown_address}, where: {id: {_eq: $id}}) {
    returning {
      id
    }
    affected_rows
  }
}
`

const CheckBoxModal = (props) => {
  const { visible, onHide ,trip_id } = props

  console.log('trip_info', trip_id)

  const [insertTopay] = useMutation(
    PRIVATE_GODWON_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onPrivateGodown = (form) => {
    console.log('form',form)
    const private_godown_address={
      building_no:form.building_no,
      address:form.address,
      city:form.city,
      state:form.state,
      pin_code:form.pin_code
    }
    insertTopay({
      variables: {
        id: trip_id,
        private_godown_address: private_godown_address
      }  
    })
  }
 
  return (
    <>
      <Modal
        title="Unloaded at private godown"
        visible={visible}
        onCancel={onHide}
        footer={null}
      >

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
        <Form layout='vertical' onFinish={onPrivateGodown}>
          <Row>
            <Col sm={20}>
              <Form.Item
                label="Building Number"
                name=" building_no"
                rules={[{ required: true, message: 'Building Number is required field!' }]}
                
              >
                <Input placeholder="Building Number"  />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={20}>
              <Form.Item
                label="Address"
                name="address"
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
                name="pin_code"
                rules={[{ required: true, message: 'Pin Code is required field!' }]}
              >
                <Input placeholder="Pin Code"  />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={20}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'City is required field!' }]}
              >
                <Input placeholder="City"/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={20}>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: 'State is required field!' }]}
              >
                <Input placeholder="State" />
              </Form.Item>
            </Col>
          </Row>
          <Row  justify='end'>
          <Button key="Update" htmlType='submit' type="primary">
            Save
          </Button>,
          <Button key='back'>
           Cancel
          </Button>
          </Row>
        </Form>
      </Modal>
    </>
  );
}


export default CheckBoxModal;