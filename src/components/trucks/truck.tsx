import React from 'react'
import {Row, Col, Space} from 'antd'
import LabelAndData from '../common/labelAndData'
import Link from 'next/link'


export default function truck(props) {
  const { data } = props
    return (
        <div>
                <Row gutter={[12, 12]}> 
                <Space  direction="horizontal">
                <LabelAndData
                colSpan={12}
                data={
                  <Link href='/partners/[id]' as={`/partners/${'Vijay'}`}>
                    <a>{'Vijay'}</a>
                  </Link>
                }
              />
               
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