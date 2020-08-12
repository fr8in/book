import React from "react";
import {
  Modal,
  Button,
  Row,
  Form,
  Select,
  Table,
  Radio,
  Col,
  Badge,
  Input,
  Divider,
  Space,
  message,
} from "antd";
import { EyeTwoTone } from "@ant-design/icons";
import { DatePicker } from "antd";
import { gql, useQuery ,useMutation} from '@apollo/client'

const TRUCKS_QUERY = gql`
query trucks($truck_id : Int){
  truck_type {
    id
    name
  }
  
  truck(where: {id: {_eq: $truck_id}}) {
    height
    truck_no
    partner {
      cardcode
      name
      partner_users(limit:1 , where:{is_admin:{_eq:true}}){
        mobile
      }
      onboarded_by {
        id
        name
        email
      }
    }
  }
  city {
    id
    name
  }
}
`

const UPDATE_TRUCK_ACTIVATION_MUTATION = gql`
mutation TruckActivation($available_at:timestamptz,$id:Int,$city_id:Int,$truck_type_id:Int,$truck_status_id:Int) {
  update_truck(_set: {available_at: $available_at, city_id:$city_id, truck_type_id:$truck_type_id,truck_status_id:$truck_status_id}, where: {id: {_eq: $id}}) {
    returning {
      id
    }
  }
}

`

function onChange(date, dateString) {
  console.log(date, dateString);
}


const TruckActivation = (props) => {
  const { visible, onHide, truck_id, title } = props;

 

  const { loading, error, data } = useQuery(
    TRUCKS_QUERY,
    {
      variables:  {truck_id : truck_id},
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('TrucksActivation error', error)

  const [updateTruckActivation] = useMutation(
    UPDATE_TRUCK_ACTIVATION_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  var truck_type = [];
  var city = [];
  
  var truck_info = {}
  
  if (!loading) {
     city = data && data.city
     truck_type = data && data.truck_type
     const { truck } = data
     truck_info = truck[0] ? truck[0] : { name: 'ID does not exist' }
  }
  const truck_data = truck_info && truck_info.truck_no
 const onboarded_by  = truck_info && truck_info.partner && truck_info.partner.onboarded_by && truck_info.partner.onboarded_by.name
 const partner_mobile = truck_info && truck_info.partner && truck_info.partner.partner_users && truck_info.partner.partner_users.mobile

  const cityList = city.map((data) => {
    return { value: data.id, label: data.name }
  })
  const typeList = truck_type.map((data) => {
    return { value: data.id, label: data.name }
  })

  const onTruckActivationSubmit = (form) => {
    console.log("Traffic Added", truck_id);
    updateTruckActivation({
      variables: {
        id: truck_id,
        truck_status_id: 1,
        available_at: form.available_at,
        city_id: parseInt(form.city_id, 10),
        truck_type_id: parseInt(form.truck_type_id, 10)
      }
    })
  };

  return (
    <>
     
      <Modal
        visible={visible}
        title="Truck Activation"
        onCancel={onHide}
        width="550px"
        footer={[
          null
        ]}
      >
        <Form layout="vertical" onFinish={onTruckActivationSubmit}>
          <Form.Item>
            <Row className="labelFix">
              <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                <h4>{truck_data}</h4>
              </Col>

              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                style={{
                  textAlign: "right",
                }}
              >
                <h4>Height:{truck_info.height}-ft</h4>
              </Col>
            </Row>
            <Divider />
            <Row className="labelFix">
              <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                <Form.Item
                  label="Truck Type"
                  name="truck_type_id"
                  rules={[{ required: true }]}
                  style={{ width: "70%" }}
                >
                  <Select options={typeList} placeholder="Select TruckType" allowClear>
                   
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                  <h4>RC</h4>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 8 }}
                style={{
                  textAlign: "right",
                }}
              >
                
                  <Button
                    type="primary"
                    shape="circle"
                    size="middle"
                    icon={<EyeTwoTone />}
                  />
              </Col>
            </Row>
            <Row className="labelFix">
              <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                <Form.Item label="Available From" name="available_at">
                  <DatePicker onChange={onChange} />
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                  <h4>Vaahan Screen</h4>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 8 }}
                style={{
                  textAlign: "right",
                }}
              >
                  <Button
                    type="primary"
                    shape="circle"
                    size="middle"
                    icon={<EyeTwoTone />}
                  />
              </Col>
            </Row>
            <Row className="labelFix">
              <Col flex="150px">
                <Form.Item label="On-Boarded By" name="On-Boarded By" >
                  <Input value={onboarded_by} placeholder="On-Boarded By" />
                </Form.Item>
              </Col>
              &nbsp;
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Form.Item
                  label="Available City"
                  name="city_id"
                  rules={[{ required: true }]}
                >
                  <Select options={cityList} placeholder="Select AvailableCity" allowClear>
                   
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Col xs={{ span: 24 }} sm={{ span: 5 }} />
              <Col xs={{ span: 24 }} sm={{ span: 14 }}>
                <label>
                  New vehicle on-boarded
                  <br />
                  Partner Name:{truck_info && truck_info.partner && truck_info.partner.name}-{partner_mobile } <br />
                  {truck_info.truck_no}-{truck_info && truck_info.truck_type && truck_info.truck_type.name}-ft
                  <br />
                  Available In <br />
                  On-boarded by-{onboarded_by}
                </label>
              </Col>
            </Row>
          </Form.Item>
          <Row>
          <Button type="primary" key="submit" htmlType='submit' style={{textAlign:'right'}} >
            Activate Truck
          </Button>
          </Row>
        </Form>
      </Modal>
     
    </>
  );
};

export default TruckActivation;
