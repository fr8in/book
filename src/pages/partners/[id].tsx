import PageLayout from '../../components/layout/pageLayout'
import PartnerDetailContainer from '../../components/partners/container/partnerDetailContainer'


const PartnerDetail = (props) => { 
  return (
    <PageLayout title={`Partner - ${props.id}`}>
        <PartnerDetailContainer  cardCode={props.id} />
    </PageLayout>
  )
}

PartnerDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default PartnerDetail
