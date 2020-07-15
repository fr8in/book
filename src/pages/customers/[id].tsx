import { useState } from 'react'
import PageLayout from "../../components/layout/pageLayout";
import CustomerInfo from '../../components/customers/customerInfo';
import CustomerDetailContainer from '../../components/customers/containers/customerDetailContainer';

const CustomerDetail = (props) => {

  return (
    <PageLayout title={`Customer - ${props.id}`}>
      <CustomerDetailContainer cardCode={props.id} />
    </PageLayout>
  )
};

CustomerDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id,
  };
};

export default CustomerDetail;
