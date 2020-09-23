import PageLayout from '../../components/layout/pageLayout'
import CreatePartnerContainer from '../../components/partners/container/createPartnerContainer'

const CreatePartner = (props) => {
  return (
    <PageLayout {...props} title='CreatePartner'>
      <CreatePartnerContainer />
    </PageLayout>

  )
}

export default CreatePartner
