const partnerDetail = (props) => {

    return <h1> Partner ID: {props.id}</h1>
  }
  
  partnerDetail.getInitialProps = ({ query }) => {
    return {
      id: query.id
    }
  }
  
  export default partnerDetail