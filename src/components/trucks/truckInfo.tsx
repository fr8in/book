import React from 'react'
import {Row,Col,Input} from 'antd'
export default function truckInfo() {
    return (
        <div>
            <Row>
                <Col>
            <Row>
                Length(Ft)
            </Row>
             <Row>
            <Input placeholder="Length" />
             </Row>
             </Col>
             <Col>
             <Row>
               Height(Ft)
            </Row>            
             <Row>
            <Input placeholder="height" />
             </Row>
             </Col>
             <Col>
             <Row>
                Breadth(Ft)
            </Row>
             <Row>
            <Input placeholder="Breadth" />
             </Row>
             </Col>
             <Col>
             <Row>
                Driner Number(Ft)
            </Row>
             <Row>
            <Input placeholder="number" />
             </Row>
             </Col>
</Row>
        </div>
    )
}
                                           
                
                                    