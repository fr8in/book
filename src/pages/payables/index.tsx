import PageLayout from '../../components/layout/pageLayout'
import PayablesContainer from '../../components/partners/payables/container/payablesContainer'

const Payables = (props) => {
  return (
    <PageLayout {...props} title='Payables'>
      <PayablesContainer />
    </PageLayout>
  )
}

export default Payables
