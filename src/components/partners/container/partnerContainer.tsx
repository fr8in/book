import React from 'react'
import {Row, Col, Button, Card} from 'antd'
import Link from 'next/link'
import PartnerList from '../partners'
export default function partnerContainer() {
    return (
        <div>
            <Row justify='end' className='m5'>    
                <Link href='partners/create-partner'>
                   <Button type="primary">Create Partner</Button>                 
                </Link>
            </Row>
                <br />
            <Row gutter={[10, 10]}>
                <Col sm={24}>
                    <Card size='small' className='card-body-0'>
                     <PartnerList />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

