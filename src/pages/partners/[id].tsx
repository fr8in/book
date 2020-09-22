import PageLayout from '../../components/layout/pageLayout'
import PartnerDetailContainer from '../../components/partners/container/partnerDetailContainer'

const Partner = (props) => { 
  return (
    <PageLayout {...props} title={`Partner - ${props.id}`}>
        <PartnerDetailContainer cardcode={props.id} />
    </PageLayout>
  )
}

Partner.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default Partner;
