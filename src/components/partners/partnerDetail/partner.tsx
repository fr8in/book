import React from 'react'
import {Row, Col} from 'antd'
import { CheckCircleOutlined,CrownFilled } from '@ant-design/icons'

export default function partnerInfo(props) {
    return (
        <div>
                <Row gutter={[10, 10]}> 
                <Col>
					<h2> <CrownFilled /> </h2>	
					</Col>
                    <Col>
					<h2> <label>Surya</label> </h2>	
					</Col>
                    <Col>
                     <h2><CheckCircleOutlined twoToneColor="#28a745" /></h2>
                       {props.children}
                    </Col>
                    <Col>
                    <h3> <label>3456254</label> </h3>
                    </Col>
                    <Col>
                    <h3> <label>9873456254</label> </h3>
                    </Col>
                </Row>
        </div>
    )
}
