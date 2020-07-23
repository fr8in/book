import React from "react";
import { Modal, Button,Input,Row,Col,Form,Select } from "antd";
import {PrinterOutlined} from '@ant-design/icons'


const { Option } = Select;
  const BillingAndInvoiced = (props) => {
    const { visible, onHide, data } = props
    function handleChange(value) {
      console.log(`selected ${value}`);
    }
    console.log('billingProps',props)
    return (
      <> 
       <Modal
      title={
          "Billing & Invoice-" 
        }
      
      visible={visible}
      onCancel={onHide}
      footer={[
        <Row justify='start' className='m5'>
          <Col >
        <Input placeholder='Email Address' />
        </Col>
        <Col flex='180'>
      <Button type="primary"> Send Email </Button>
      <Button > Close </Button>
      </Col>
      </Row>
       ]}
       
      >
 <Form layout='vertical'>
                <Row gutter={10}>
                    <Col sm={12}>
                            <Form.Item
                                label="Users"
                            >
                                <Select defaultValue="Select Users"  onChange={handleChange} />
                            </Form.Item> 
                    </Col>
                    </Row>
                    <Row gutter={10}>
                    <Col sm={12}>
                            <Form.Item
                                label="Branch Address"
                            >
                               <Input placeholder="Address"  />
                            </Form.Item> 
                    </Col>
                    <Col sm={12}>
                            <Form.Item
                                label="Contact Number"
                            >
                                 <Input placeholder="Contact Number"   />
                            </Form.Item> 
                    </Col>
                    </Row>
                    <Row gutter={10}>
                    <Col sm={12}>
                            <Form.Item
                                label="GST Number"
                            >
                               <Input placeholder="GST Number" />
                            </Form.Item> 
                    </Col>
                    <Col sm={12}>
                            <Form.Item
                                label="HSN Number"
                            >
                                 <Input placeholder="HSN Number" />
                            </Form.Item> 
                    </Col>
                    </Row>
                    </Form>
       <Row justify='end' className='m5'>
          <Button type='primary' icon={<PrinterOutlined />}> Save & Print Invoice</Button>
        </Row>        
        </Modal>
      </>
    );
  }


export default BillingAndInvoiced;