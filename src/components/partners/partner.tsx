import React from 'react'
import { Row, Col ,Space,Typography} from 'antd'
import { CheckCircleOutlined, CrownFilled } from '@ant-design/icons'

const { Text, Link} = Typography;
export default function partnerInfo() {
    return (
        <Row >
          <Space  direction="horizontal">
          <h2> <CrownFilled /> </h2>
          <h2>   <text>SAEF LOGISTICS</text> </h2>
          <h2> <CheckCircleOutlined /> </h2>
          <h4>  <text> ST563869 </text> </h4>
          
         <h4>  <Link href="https://ant.design" target="_blank">
                    9873456254 
                </Link> </h4>
            </Space>
        </Row>


    )
}
