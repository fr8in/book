import React from 'react'
import {Row, Col, Input, Card} from 'antd'
import TrucksList from '../trucks'

const { Search } = Input;

export default function truckContainer() {
    return (
        <div>
            <Row justify='end' className='m5'>
                <Col flex='180px'>
                  <Search
                    placeholder='Search...'
                    onSearch={(value) => console.log(value)}
                  />
                </Col>
              </Row>
                
            <Row gutter={[10, 10]}>
                <Col sm={24}>
                    <Card size='small' className='card-body-0'>
                     <TrucksList />
                    </Card>
                    </Col>
            </Row>
        </div>
    )
}

