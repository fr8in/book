import PageLayout from '../../../components/layout/pageLayout'
import PartnerOnboardingContainer from '../../../components/partners/container/partnerOnboardingContainer'

const LeadConvertion = (props) => {
  return (
    <PageLayout {...props} title={`Lead - ${props.id}`}>
      <PartnerOnboardingContainer partner_id={props.id} />
    </PageLayout>
  )
}

LeadConvertion.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default LeadConvertion;
