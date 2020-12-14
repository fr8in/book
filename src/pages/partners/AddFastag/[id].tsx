import PageLayout from '../../../components/layout/pageLayout'
import AddFastagContainer from '../../../components/partners/cards/containter/addFastagContainer'

const AddFastag = (props) => {
  return (
    <PageLayout {...props} title={`AddFastag - ${props.id}`}>
      <AddFastagContainer cardcode={props.id}/>
    </PageLayout>
  )
}

AddFastag.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}


export default AddFastag 