import PageLayout from "../../../components/layout/PageLayout";

const CustomerDetail = (props) => {
  console.log("object", props);
  return (
    <PageLayout title={`Customer - ${props.id}`}>
      <h1>Customer ID: {props.id}</h1>
    </PageLayout>
  );
};

CustomerDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id,
  };
};

export default CustomerDetail;
