import PageLayout from "../../components/layout/pageLayout";
import CustomerDetailContainer from '../../components/customers/containers/customerDetailContainer';

const Customer = (props) => {
  return (
    <PageLayout {...props} title={`Customer - ${props.id}`}>
      <CustomerDetailContainer cardcode={props.id} />
    </PageLayout>
  )
};

Customer.getInitialProps = ({ query }) => {
  return {
    id: query.id,
  };
};

export default Customer;
