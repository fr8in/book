import { useState } from 'react'
import { Row, Checkbox } from 'antd'
import moment from 'moment'
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

  const onChange = (e) => {
    setValue({ ...value, managed: e.target.checked })
  }

  return (
    <Row gutter={8}>
      <LabelAndData
        label='Type'
        data={<label>{customerInfo.type_id}</label>}
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
        label='Exception'
        data={<label>{mockData.exception_date && moment(mockData.exception_date).format('DD-MM-YYYY')}</label>}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='Payment Manager'
        data={customerInfo.payment_manager_id}
        mdSpan={4}
        smSpan={8}
        xsSpan={24}
      />
      <LabelAndData
        label='S.Mamul'
        data={mockData.systemMamul}
        mdSpan={4}
        smSpan={8}
        xsSpan={24}
      />
      <LabelAndData
        label='Pending'
        data={<label>{mockData.paymentPending}</label>}
        mdSpan={4}
        smSpan={8}
        xsSpan={24}
      />
    </Row>
  )
}

export default CustomerInfo
