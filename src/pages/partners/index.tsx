import {Row, Col, Card,Button} from 'antd'
import PageLayout from '../../components/layout/pageLayout'
import PartnerList from '../../components/partners/partners'
import Link from 'next/link'
const Partner = () => {
  return (
    <PageLayout title='Partner'>
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
     
    </PageLayout>
    
  )
}

export default Partner
