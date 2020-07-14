import PageLayout from '../../../components/layout/pageLayout'
import HeaderInfo from '../../../components/partners/partnerDetail/partner'
import WalletStatus from '../../../components/partners/partnerDetail/walletStatus'
import BasicDetail from '../../../components/partners/partnerDetail/partnerInfo'
import DetailTable from '../../../components/partners/partnerDetail/partnerTable'
import Barchart from '../../../components/partners/partnerDetail/barChart'
import Summary from '../../../components/partners/partnerDetail/summary'
import PartnerStatus from '../../../components/partners/partnerDetail/partnerStatus'
import { Row, Col, Divider } from 'antd'

const PartnerDetail = (props) => {

  console.log('object', props)
  return (
    <PageLayout title={`Partner - ${props.id}`}>
      <Row>   
        <Col span={22}>
          <HeaderInfo />
        </Col>
        <Col>
          <WalletStatus />
        </Col>
      </Row>
     
      <Divider />
      <Row gutter={[10, 10]}>
        <Col xs={24} sm={12} md={8}>
          <BasicDetail />
          <br />
          <PartnerStatus />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Barchart />
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Summary />
        </Col>
      </Row>
      <br />
      <DetailTable />
    </PageLayout>
  )
}

PartnerDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default PartnerDetail
