import { Row, Button } from 'antd'
import LabelAndData from '../common/labelAndData'

const InvoiceDetail = () => {
  return (
    <Row>
      <LabelAndData
        label={<p className='mb0 b'>{`Partner (AP: ${20023314})`}</p>}
        data={<Button danger>AP cancel</Button>}
      />
      <LabelAndData
        label={<p className='mb0 b'>{`Customer (AR: ${20003976})`}</p>}
        data={<Button danger>AR cancel</Button>}
      />

    </Row>
  )
}

export default InvoiceDetail
