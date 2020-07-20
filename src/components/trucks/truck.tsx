import React from 'react'
import {Row, Col, Space} from 'antd'

export default function truck(props) {
    return (
        <div>
                <Row gutter={[12, 12]}> 
                <Space  direction="horizontal">
                    <Col >
                    <h1> Singh</h1> 
                    </Col>
                    <Col >
                     <h2>MH14GD1806</h2>
                    </Col>
                    <Col >
                    <h3> <label>Kalamboli</label> </h3>
                    </Col>
                    </Space>
                    </Row>

                    <Row gutter={[10, 10]}>
                    <Space  direction="horizontal">
                    <Col>
                    <h3> <label>9873456254</label> </h3>
                    </Col>

                    <Col>
                    <h3> <label>32 Feet Single Axle</label> </h3>
                    </Col>

                    <Col>
                    <h3> <label>Tat:0.49</label> </h3>
                    </Col>
                    </Space>
                </Row>
        </div>
    )
}