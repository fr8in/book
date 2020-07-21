import React from 'react'
import {Row,Col,InputNumber,Form,Space} from 'antd'

function onChange(value) {
    console.log('changed', value);
  }

export default function truckInfo() {
    return (
        <div>
             <Form layout='vertical'>
                 <Space>
            <Row gutter={10}>
           
                    <Col xs={24} sm={5}>
             
                            <Form.Item
                                label="Length(Ft)"
                                name="Length(Ft)"
                                rules={[{ required: true, message: 'Length(Ft) is required field' }]}
                            >
                               <InputNumber min={1} max={10} onChange={onChange} placeholder="Length(Ft)"/>
                            </Form.Item> 
                    </Col>
                    <Col xs={24} sm={5}>
                            <Form.Item
                                label="Breadth(Ft)"
                                name="Breadth(Ft)"
                                rules={[{ required: true, message: 'Breadth(Ft) is required field' }]}
                            >
                                <InputNumber min={1} max={10} onChange={onChange} placeholder="Breadth(Ft)" />
                            </Form.Item> 
                    </Col>
                    <Col xs={24} sm={5}>
                    
                            <Form.Item
                                label="Height(Ft)"
                                name="Height(Ft)"
                                rules={[{ required: true, message: 'Height(Ft) is required field' }]}
                            >
                                <InputNumber  min={1} max={10} onChange={onChange}  placeholder="Height(Ft)" />
                            </Form.Item> 
                            
                    </Col>
                   
                    </Row>
                    </Space>
                    </Form>
        </div>
    )
}
                                           
                
                                    