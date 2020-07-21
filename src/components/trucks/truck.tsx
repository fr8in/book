import React from 'react'
import LabelAndData from '../common/labelAndData'
import Link from 'next/link'
import data from '../../../mock/trucks/truckDetail'
import { Row,Col } from "antd";

const Truck = (props) => {
  console.log('id', props)
  
    return (
        <div>
            <Row gutter={10}>
              <Col span={8}>
                <LabelAndData
                colSpan={6}
                data={
                  <Link href='/partners/[id]' as={`/partners/${'Vijay'}`}>
                   <h1> <a>{'Vijay'}</a> </h1>
                  </Link> 
                }
              />
              </Col>
              <Col span={8}>
             <LabelAndData
                colSpan={12}
                data={data.truck.truckid }
              />
             </Col>
             <Col span={8}>
             <LabelAndData
                colSpan={12}
                data={data.truck.destination }
              />
             </Col>
             </Row>
             <Row gutter={10}>
             <Col span={8}>
             <LabelAndData
                colSpan={12}
                data={data.truck.phonenumber }
              />
             </Col>
             <Col span={8}>
             <LabelAndData
                colSpan={12}
                data={data.truck.trucktype}
              />
             </Col>
             <Col span={8}>
             <LabelAndData
                colSpan={12}
                data={data.truck.tat }
              />
             </Col>
             </Row>
              
        </div>
    )
}

export default  Truck