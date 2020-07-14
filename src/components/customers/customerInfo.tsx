import { useState } from 'react'
import { Row, Col } from 'antd'
import data from '../../../mock/customer/customerDetail'
import LabelWithData from '../common/labelWithData'
import InlineEdit from '../common/inlineEdit'

const CustomerInfo = () => {
  const initial = {
    gst: data.gst,
    region: data.region,
    paymentManager: data.paymentManager,
    onBoardedBy: data.onBoardedBy
  }
  const [value, setValue] = useState(initial)
  const editSubmit = (objKey, text) => {
    console.log('value', text)
    setValue({ ...value, [objKey]: text })
  }
  return (
    <Row>
      <Col xs={24} sm={24} md={12}>
        <LabelWithData label='PAN' data={data.pan} labelSpan={10} dataSpan={14} />
        <LabelWithData label='LR' data={data.lr} labelSpan={10} dataSpan={14} />
        <LabelWithData
          label='GST No'
          data={<InlineEdit text={value.gst} objKey='gst' onSetText={text => setValue({ ...value, gst: text })} onSubmit={editSubmit} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='BP Code' data={data.cardCode} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Virtual Account' data={data.virtualAccount} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Mobile No' data={data.mobileNo} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Region' data={data.region} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Payment Manager' data={data.paymentManager} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Receivable Days' data={data.receivableDays} labelSpan={10} dataSpan={14} />
        <LabelWithData label='OnBoarded By' data={data.onBoardedBy} labelSpan={10} dataSpan={14} />
      </Col>
      <Col xs={24} sm={24} md={12}>
                a
      </Col>
    </Row>
  )
}

export default CustomerInfo
