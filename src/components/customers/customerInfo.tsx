import { useState } from 'react'
import { Row, Space, Button, Checkbox } from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import moment from 'moment'
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
        label='PAN'
        data={
          <Space>
            <span>{customerInfo.pan}</span>
            {customerInfo.panUrl
              ? <Button type='primary' shape='circle' icon={<DownloadOutlined />} size='small' />
              : <Button shape='circle' icon={<UploadOutlined />} size='small' />}
          </Space>
        }
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
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
        label='Limit'
        data={<InlineEdit text={value.credit_limit} objKey='creditLimit' onSetText={onSubmit} />}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
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
