import React from "react";
import { Modal, Button, Input , Select, Form} from "antd";
import {UserBranch,OperatingCities}  from '../../../mock/customer/createCustomerUserMock'


  const CreateCustomerUser = (props) => {
    const { visible, onHide } = props

    const onSubmit = () => {
      console.log('data Transfered!')
      onHide()
    }

    function handleChange(value) {
        console.log(`selected ${value}`);
      }

    return (
      <> 
       <Modal
      title="Add User"
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      width={450}
      footer={[
        <Button > Cancel </Button>,
        <Button type="primary"> Add User </Button>
       ]}
      >
          
          <Form.Item> <Input placeholder="Name" /> </Form.Item> 
          <Form.Item>    <Input placeholder="Mobile No" /> </Form.Item> 
          <Form.Item>   <Input placeholder="E-Mail" /> </Form.Item> 
          <Form.Item>  <Select defaultValue="User Branch" style={{width: 300}} onChange={handleChange} options={UserBranch} ></Select> </Form.Item> 
          <Form.Item>  <Select defaultValue="Enter Operating Cities" style={{width: 300}} onChange={handleChange} options={OperatingCities} ></Select> </Form.Item> 
         
        </Modal>
      </>
    );
  }


export default CreateCustomerUser