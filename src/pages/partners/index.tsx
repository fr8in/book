import {Row, Col, Card} from 'antd'
import PageLayout from '../../components/layout/pageLayout'
import PartnerList from '../../components/partners/partners'
import CreatePartner from '../../components/partners/partnerDetail/createPartner'
const Partner = () => {
  return (
    <PageLayout title='Partner'>
      
       <CreatePartner />
      
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
