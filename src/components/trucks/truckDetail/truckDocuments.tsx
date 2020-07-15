import React from 'react'
import {Row,Col,Input,Button} from 'antd'
import { UploadOutlined} from '@ant-design/icons';
export default function truckDocuments() {
    return (
        <div>
            <Row gutter={[10, 10]}>
                <Col xs={24} sm={12} md={6}>
            <Row>
                PAN
            </Row>
            <br />
             <Row>
            <Button icon={<UploadOutlined />} >
            Select File
                </Button>
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
            RC 
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
            Vaahan Screen 
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
                                           
                
                                    