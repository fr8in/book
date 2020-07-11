import PageLayout from '../../../components/layout/PageLayout'

const PartnerDetail = (props) => {

console.log('object', props)
  return (
    <PageLayout title={`Partner - ${props.id}`}>
      <h1>Partner ID: {props.id}</h1>
    </PageLayout>
  )
}

PartnerDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default PartnerDetail
