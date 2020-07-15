import React from 'react'
import DetailInfo from './partnerDetail'
import Document from '../../../components/partners/partnerDetail/partnerDocument'
import {Row, Col} from 'antd'
export default function detail() {
    return (
        <div>
            <br />
            <Row gutter={[10, 10]}>
                <Col xs={24} sm={12}>
                <DetailInfo/>
                </Col>
                <Col xs={24} sm={12}>
                <Document />
                </Col>
              
            </Row>
        </div>
    )
}
