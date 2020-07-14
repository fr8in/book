import {useState} from 'react'
import PageLayout from "../../../components/layout/pageLayout";
import { Row, Col, Card } from "antd";
import InlineEdit from '../../../components/common/inlineEdit'
import Blacklist from '../../../components/customers/blacklist';
import CustomerInfo from '../../../components/customers/customerInfo';

const CustomerDetail = (props) => {
  console.log("object", props);
  const [storedHeading, setStoredHeading] = useState(
    "Click here to start editing the text!"
  );
  const onCustomerNameSave = (value) => {
    console.log('value', value)
  }
  return (
    <PageLayout title={`Customer - ${props.id}`}>
      <Card 
        title={<InlineEdit 
                text={storedHeading}
                onSetText={text => setStoredHeading(text)}
                onSubmit = {onCustomerNameSave}
              />}
        extra={<Blacklist />}
      >
        <Row gutter={[10,10]}>
          <Col sm={13}>
            <CustomerInfo />
          </Col>
          <Col xs={11}/>
        </Row>
      </Card>
    </PageLayout>
  )
};

CustomerDetail.getInitialProps = ({ query }) => {
  return {
    id: query.id,
  };
};

export default CustomerDetail;
