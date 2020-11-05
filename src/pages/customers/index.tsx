import PageLayout from '../../components/layout/pageLayout'
import CustomersContainer from '../../components/customers/containers/customersContainer'

const CustomersPage = (props) => {
  return (
    <PageLayout {...props} title='Customers'>
      <CustomersContainer {...props}/>
    </PageLayout>
  )
}

export default CustomersPage
