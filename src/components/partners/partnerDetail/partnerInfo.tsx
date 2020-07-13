import React from 'react'
import {Row, Col} from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

export default function partnerInfo(props) {
    return (
        <div>
                <Row>
                    <Col span={1}>
					<h2> <label>Surya</label> </h2>	
					</Col>
                    <Col span={1}>
                     <h2><CheckCircleOutlined twoToneColor="#52c41a" /></h2>
                       {props.children}
                    </Col>
                    <Col span={2}>
                    <h3> <label>3456254</label> </h3>
                    </Col>
                    <Col span={2}>
                    <h3> <label>9873456254</label> </h3>
                    </Col>
                </Row>
        </div>
    )
}
