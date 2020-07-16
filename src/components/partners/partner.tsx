import React from 'react'
import { Row, Col ,Space} from 'antd'
import { CheckCircleOutlined, CrownFilled } from '@ant-design/icons'

export default function partnerInfo() {
    return (
        <Row justify="start">
          <Space>
            <Col ><CrownFilled /></Col>
            <Col ><label>Surya</label></Col>
            <Col><CheckCircleOutlined /></Col>
            <Col>3456254</Col>
            <Col>9873456254</Col>
            </Space>
        </Row>


    )
}
