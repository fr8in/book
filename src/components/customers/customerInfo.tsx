import { useState } from 'react'
import { Row, Col, Checkbox } from 'antd'
import InlineEdit from '../common/inlineEdit'
import LabelAndData from '../common/labelAndData'

import mockData from '../../../mock/customer/customerDetail'

const CustomerInfo = (props) => {
  const { customerInfo } = props
  const initial = {
    gst: customerInfo.gst,
    credit_limit: customerInfo.credit_limit,
    managed: customerInfo.managed
  }
  const [value, setValue] = useState(initial)

  const onSubmit = (objKey, text) => {
    setValue({ ...value, [objKey]: text })
  }
  const onChange = (e) => {
    setValue({ ...value, managed: e.target.checked })
  }

  return (
    <Row gutter={8}>
      <LabelAndData
        label='Company Type'
        data={customerInfo.type_id}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='Managed'
        data={
          <Checkbox
            onChange={onChange}
            checked={value.managed}
            disabled={false}
          >
                Yes
          </Checkbox>
        }
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='Exception Date'
        data={customerInfo.exception_date}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='Credit Limit'
        data={<InlineEdit text={value.credit_limit} objKey='creditLimit' onSetText={onSubmit} />}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='Payment Pending'
        data={mockData.paymentPending}
        mdSpan={4}
        smSpan={8}
        xsSpan={24}
      />
    </Row>
  )
}

export default CustomerInfo
