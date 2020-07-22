import React from "react";
import { Modal, Button, Input , Select,Form} from "antd";
import { LeftOutlined } from '@ant-design/icons'
import {City,State}  from '../../../mock/customer/createCustomerBranchMock'


  const CreateCustomerBranch = (props) => {
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
      title="Add/Edit Branch"
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      width={450}
      footer={[
        <Button type='primary'> <LeftOutlined />Back</Button>,
        <Button type="primary"> Save </Button>
       ]}
      >
         <Form.Item> <Input placeholder="Branch Name" /> </Form.Item> 
         <Form.Item>    <Input placeholder="Name" /> </Form.Item> 
         <Form.Item>   <Input placeholder="Building Number" /> </Form.Item> 
         <Form.Item>  <Input placeholder="Address" /> </Form.Item> 
             <Form layout='vertical'>
                        <Form.Item
                                label="City:"
                                name="City:"
                                rules={[{ required: true, message: 'City is required field' }]}
                            >
                               <Select defaultValue=" " style={{width: 300}} onChange={handleChange} options={City} ></Select>
                            </Form.Item> 
               
                            <Form.Item
                                label="State:"
                                name="State:"
                                rules={[{ required: true, message: 'State is required field' }]}
                            >
                               <Select defaultValue=" " style={{width: 300}} onChange={handleChange} options={State} ></Select>
                            </Form.Item> 
                            </Form>
                            <Form.Item>   <Input placeholder="Pin Code" /> </Form.Item> 
                            <Form.Item>   <Input placeholder="Contact Number" /> </Form.Item> 
        </Modal>
      </>
    );
  }


export default CreateCustomerBranch