import { useState } from 'react'
import PageLayout from "../../../components/layout/pageLayout";
import CustomerInfo from '../../../components/customers/customerInfo';

const CustomerDetail = (props) => {

  return (
    <PageLayout title={`Customer - ${props.id}`}>
      <CustomerInfo cardCode={props.id} />

    </PageLayout>
  )
};

CustomerDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id,
  };
};

export default CustomerDetail;
