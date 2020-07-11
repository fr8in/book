

const PartnerDetail = (props) => {

console.log('object', props)
  return <h1>Partner ID: {props.id}</h1>
}

PartnerDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id
  }
}

export default PartnerDetail
