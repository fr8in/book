const TruckDetail = (props) => {

  return <h1>Truck ID: {props.id}</h1>
}

TruckDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default TruckDetail
