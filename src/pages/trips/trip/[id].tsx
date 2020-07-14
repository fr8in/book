const TripDetail = (props) => {

  return <h1>Trip ID: {props.id}</h1>
}

TripDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default TripDetail
