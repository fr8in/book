import { Row, Button } from 'antd'
import LabelAndData from '../common/labelAndData'

const InvoiceDetail = () => {
  return (
    <Row>
      <LabelAndData
        label={`Partner (AP: ${20023314})`}
        data={<Button danger>AP cancel</Button>}
      />
      <LabelAndData
        label={`Customer (AR: ${20003976})`}
        data={<Button danger>AR cancel</Button>}
      />
    </Row>
  )
}

export default InvoiceDetail
