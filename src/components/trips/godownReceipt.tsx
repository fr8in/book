import { Modal, Button, Row, Col, Form, Input,message } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import {useState} from "react";

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

  const [BuildingNO, setBuildingNO] = useState('')
  const [Address, setAddress] = useState('')
  const [City, setCity] = useState('')
  const [Pincode, setPincode] = useState('')
  const [State, setState] = useState('')

  const handlebuildingNo = (e) => {
    setBuildingNO(e.target.value)
  }
  console.log('BuildingNO', BuildingNO)

  const handleaddress = (e) => {
    setAddress(e.target.value)
  }
  console.log('Address', Address)

  const handlecity = (e) => {
    setCity(e.target.value)
  }
  console.log('City', City)

  const handlepincode = (e) => {
    setPincode(e.target.value)
  }
  console.log('Pincode', Pincode)

  const handlestate = (e) => {
    setState(e.target.value)
  }
  console.log('State', State)

  const [insertTopay] = useMutation(
    PRIVATE_GODWON_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const privateGodown = () => {
    console.log('trip_id',trip_id)
    insertTopay({
      variables: {
        "id": trip_id,
        "private_godown_address": {"building_no": BuildingNO, "address": Address, "city": City, "pincode": Pincode, "state": State}
      }
    })
  }

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
          <Button key="Update" onClick={privateGodown} type="primary">
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
                <Input placeholder="Building Number" onChange={handlebuildingNo} />
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
                <Input placeholder="Address" onChange={handleaddress}/>
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
                <Input placeholder="Pin Code" onChange={handlepincode} />
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
                <Input placeholder="City" onChange={handlecity}/>
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
                <Input placeholder="State" onChange={handlestate}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}


export default CheckBoxModal;