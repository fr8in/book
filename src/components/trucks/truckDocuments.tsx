import React from 'react'
import {Row,Col,Button,Form} from 'antd'
import { UploadOutlined} from '@ant-design/icons';
export default function truckDocuments() {
    return (
        <div>
            <Row gutter={[10, 10]}>
                <Col xs={24} sm={12} md={6}>
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
             <br />
             <Row>
             <Button disabled>  Start Upload </Button>
             </Row>
             </Col>
             
             <Col xs={24} sm={12} md={6}>
            <Row>
            Cancelled cheque/PassBook
            </Row>
            <br />
            <Row>
            <Button icon={<UploadOutlined />} >
            Select File
                </Button>
             </Row>
             <br />
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>

             <Col xs={24} sm={12} md={6}>
            <Row>
            TDS Document
            </Row>
            <br />
            <Row>
            <Button icon={<UploadOutlined />} >
            Select File
                </Button>
             </Row>
             <br />
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>
             
             <Col xs={24} sm={12} md={6} >
            <Row>
            EMI 
            </Row>
            <br />
            <Row>
            <Button icon={<UploadOutlined />} >
            Select File
                </Button>
             </Row>
             <br />
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>
</Row>

       <Row gutter={[10, 10]}>
       <Col xs={24} sm={12} md={6}>
            
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
             <br />
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>

             <Col xs={24} sm={12} md={6}>
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
             <br />
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>

             <Col xs={24} sm={12} md={6}>
            <Row>
            Insurance
            </Row>
            <br />
            <Row>
            <Button icon={<UploadOutlined />} >
            Select File
                </Button>
             </Row>
             <br />
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>

             <Col xs={24} sm={12} md={6}>
            <Row>
            Permit
            </Row>
            <br />
            <Row>
            <Button icon={<UploadOutlined />} >
            Select File
                </Button>
             </Row>
             <br />
             <Row>
             <Button disabled> Start Upload </Button>
             </Row>
             </Col>
       </Row>
        </div>
    )
}
                                           
                
                                    