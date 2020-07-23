
import {Row, Button, Card} from 'antd'
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
                <Card size='small' className='card-body-0 border-top-blue' >
                     <PartnerList />
                </Card>
        </div>
    )
}

