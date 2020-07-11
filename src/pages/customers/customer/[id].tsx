const CustomerDetail = (props) => {

  return <h1>Customer ID: {props.id}</h1>
}

CustomerDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default CustomerDetail
