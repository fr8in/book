import PageLayout from '../../../layout/pageLayout'
import AddFuelContainer from '../containter/addFuelcardContainer'

const AddFuel = (props) => {
  return (
    <PageLayout {...props} title='AddFuel'>
      <AddFuelContainer />
    </PageLayout>
  )
}
export default AddFuel
