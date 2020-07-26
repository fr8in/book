import React from 'react'
import { Row, Col, Card, Input,Button, Form,Divider,Space,Select} from 'antd';
import {City,Trucktype} from '../../../../mock/trucks/addTruck'
import LabelAndData from '../../common/labelAndData'
import Link from 'next/link'

const { Option } = Select;

 function AddTruck() {

    function handleChange(value) {
        console.log(`selected ${value}`);
      }
      
    return (
        <div>
                  
                  <LabelAndData
                smSpan={6}
                data={
                  <Link href='/partners/[id]' as={`/partners/${'Vijay'}`}>
                   <h1> <a>{'Savdesh Kumar'}</a> </h1>
                  </Link> 
                }
              />
            
            <Divider />
            
            <br />
            <br />
            <Card title="Truck Detail">
                <Form layout='vertical'>
                <Row gutter={10}>
                    <Col  span={8} >
                            <Form.Item
                                label="Truck Number"
                                name="Truck Number"
                                rules={[{ required: true, message: 'Truck Number is required field!' }]}
                            >
                                <Input placeholder="Truck Number" />
                            </Form.Item> 
                    </Col>
                    <Col   span={8} >
                        
                            <Form.Item
                                label="Current City"
                                name="Current City"
                                rules={[{ required: true, message: 'Current City is required field!' }]}
                            >
                                 <Select defaultValue="Chennai" style={{ width: 380 }} onChange={handleChange} options={City}/>
                            </Form.Item>
                    </Col>
                    <Col   span={8}>
                       
                            <Form.Item
                                label="Driver Number"
                                name="Driver Number"
                                rules={[{ required: true, message: 'Driver Number is required field' }]}
                            >
                                <Input placeholder="Driver Number" />
                            </Form.Item> 
                    </Col>
                    </Row> <br/>

                    <Row gutter={10}>
                    <Col   span={6}>
                        
                            <Form.Item
                                label="Truck Type"
                                name="Truck Type"
                                rules={[{ required: true, message: 'Truck Type is required field' }]}
                            >
                          <Select defaultValue="32 Feet Multi Axle" style={{ width: 280 }} onChange={handleChange} options={Trucktype}/>
                            </Form.Item> 
                    </Col>
                    <Col   span={6}>
                        
                            <Form.Item
                                label="Length(Ft)"
                                name="Length(Ft)"
                                rules={[{ required: true, message: 'Length(Ft) is required field' }]}
                            >
                               <Input placeholder="Length(Ft)" type='number'disabled={false}/>
                            </Form.Item> 
                    </Col>
                    <Col   span={6}>
                        
                            <Form.Item
                                label="Breadth(Ft)"
                                name="Breadth(Ft)"
                                rules={[{ required: true, message: 'Breadth(Ft) is required field' }]}
                            >
                                <Input placeholder="Breadth(Ft)" type='number'disabled={false} />
                            </Form.Item> 
                    </Col>
                    <Col   span={6}>
                        
                            <Form.Item
                                label="Height(Ft)"
                                name="Height(Ft)"
                                rules={[{ required: true, message: 'Height(Ft) is required field' }]}
                            >
                                <Input placeholder="Height(Ft)" type='number'disabled={false}/>
                            </Form.Item> 
                    </Col>
                    </Row>
                    </Form>
            </Card> 
            <br />
            <Row justify="end" className="m5">
                <Space>
               
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
               
                    <Button >
                        Cancel
                    </Button>
               </Space>
            </Row>
            </div>
    )
}

export default AddTruck