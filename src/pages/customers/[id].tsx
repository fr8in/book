import PageLayout from "../../components/layout/pageLayout";
import CustomerDetailContainer from '../../components/customers/containers/customerDetailContainer';

const Customer = (props) => {
  return (
    <PageLayout title={`Customer - ${props.id}`}>
      <CustomerDetailContainer cardCode={props.id} />
    </PageLayout>
  )
};

Customer.getInitialProps = ({ query }) => {
  return {
    id: query.id,
  };
};

export default Customer;
