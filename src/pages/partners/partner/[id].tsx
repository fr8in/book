import PageLayout from '../../../components/layout/PageLayout'
import HeaderInfo from '../../../components/partners/partnerDetail/partnerInfo'
import WalletStatus from '../../../components/partners/partnerDetail/walletStatus'
import BasicDetail from '../../../components/partners/partnerDetail/partnerBasicDetail'
import DetailTable from '../../../components/partners/partnerDetail/partnerDetailTable'
import { Row, Col } from 'antd'
const PartnerDetail = (props) => {

  console.log('object', props)
  return (
    <PageLayout title={`Partner - ${props.id}`}>
      <Row>
        <Col span={22} >
          <HeaderInfo />
        </Col>
        <Col span={2}>
          <WalletStatus />
        </Col>
      </Row>
      <hr />
      <br />
      <br />
      <BasicDetail />
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
