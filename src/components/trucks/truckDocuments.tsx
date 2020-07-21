import React from 'react'
import {Row,Col,Button,Form} from 'antd'
import { UploadOutlined} from '@ant-design/icons';
export default function truckDocuments() {
    return (
        <div>
            <Form layout='vertical'>
            <Row gutter={[10, 10]}>
                <Col span={6}>
             <Row>
             <Form.Item
                 label="PAN"
                 name="PAN"
                 rules={[{ required: true, message: 'PAN is required field!' }]}>
                <Button icon={<UploadOutlined />} >
            Select File
                </Button>
                            </Form.Item> 
             </Row>
             <Row>
             <Button disabled>  Start Upload </Button>
             </Row>
             </Col>
             
             <Col span={6}>
            <Row>
            <Form.Item
                 label="Cancelled cheque/PassBook">
                     <Button icon={<UploadOutlined />} >
            Select File
                </Button>
                 </Form.Item> 
            </Row>
            
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>

             <Col span={6}>
            <Row>
            <Form.Item
                 label="TDS Document">
                     <Button icon={<UploadOutlined />} >
            Select File
                </Button>
                 </Form.Item> 
            </Row>

             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>
             
             <Col span={6} >
            <Row>
            <Form.Item
                 label="EMI">
                     <Button icon={<UploadOutlined />} >
            Select File
                </Button>
                 </Form.Item> 
            </Row>
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>
</Row>

       <br/>
       <Row gutter={[10, 10]}>
       <Col span={6}>
            
            <Row>
            <Form.Item
                 label="RC"
                 name="RC"
                 rules={[{ required: true, message: 'RC is required field!' }]}>
                <Button icon={<UploadOutlined />} >
            Select File
                </Button>
                            </Form.Item> 
             </Row>
        
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>

             <Col span={6} >
             <Row>
            <Form.Item
                 label="Vaahan Screen"
                 name="Vaahan Screen"
                 rules={[{ required: true, message: 'Vaahan Screen is required field!' }]}>
                <Button icon={<UploadOutlined />} >
            Select File
                </Button>
                            </Form.Item> 
                            </Row>
            
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>

             <Col span={6} >
            <Row>
            <Form.Item
                 label="Insurance">
                     <Button icon={<UploadOutlined />} >
            Select File
                </Button>
                 </Form.Item> 
            </Row>
            
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>

             <Col span={6}>
            <Row>
            <Form.Item
                 label="Permit">
                      <Button icon={<UploadOutlined />} >
            Select File
                </Button>
                 </Form.Item> 
            </Row>
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>
       </Row>
       </Form>
        </div>
    )
}
                                           
                
                                    