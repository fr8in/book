import React from 'react'
import DetailInfo from '../../../components/partners/partnerDetail/partnerDetailInfo'
import Document from '../../../components/partners/partnerDetail/partnerDocument'
import {Row, Col} from 'antd'
export default function detail() {
    return (
        <div>
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
