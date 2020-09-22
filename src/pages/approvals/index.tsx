import PageLayout from '../../components/layout/pageLayout'
import ApprovalsContainer from '../../components/partners/approvals/container/approvalsContainer'

const Approvals = (props) => {
  return (
    <PageLayout {...props} title='Approval'>
      <ApprovalsContainer />
    </PageLayout>
  )
}

export default Approvals
