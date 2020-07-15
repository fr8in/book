import React from 'react'
import {Row,Col,Input,Space} from 'antd'
export default function truckInfo() {
    return (
        <div>
            <Space>
            <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={6}>
            <Row>
                Length(Ft)
            </Row>
             <Row>
            <Input placeholder="Length" />
             </Row>
             </Col>
             <Col xs={24} sm={12} md={6}>
             <Row>
               Height(Ft)
            </Row>            
             <Row>
            <Input placeholder="height" />
             </Row>
             </Col>
             <Col xs={24} sm={12} md={6}>
             <Row>
                Breadth(Ft)
            </Row>
             <Row>
            <Input placeholder="Breadth" />
             </Row>
             </Col >
             <Col xs={24} sm={12} md={6}>
             <Row>
                Driver Number(Ft)
            </Row>
             <Row>
            <Input placeholder="number" />
             </Row>
             </Col>
            
</Row>
</Space>
        </div>
    )
}
                                           
                
                                    