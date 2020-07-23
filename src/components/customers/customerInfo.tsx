import { useState } from 'react'
import { Row, Col, Checkbox, Space, Button } from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import InlineEdit from '../common/inlineEdit'
import LabelWithData from '../common/labelWithData'

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
      <Col xs={24} sm={24} md={12}>
        <LabelWithData
          label='PAN'
          data={
            <Space>
              <span>{customerInfo.pan}</span>
              {customerInfo.panUrl
                ? <Button type='primary' shape='circle' icon={<DownloadOutlined />} size='small' />
                : <Button shape='circle' icon={<UploadOutlined />} size='small' />}
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='LR'
          data={
            <Space>
              {customerInfo.lrUrl
                ? <Button type='primary' shape='circle' icon={<DownloadOutlined />} size='small' />
                : <Button shape='circle' icon={<UploadOutlined />} size='small' />}
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='GST No'
          data={<InlineEdit text={value.gst} objKey='gst' onSetText={onSubmit} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='BP Code' data={customerInfo.cardcode} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Virtual Account' data={customerInfo.virtual_account} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Mobile No' data={customerInfo.mobile} labelSpan={10} dataSpan={14} />
        <LabelWithData
          label='Payment Manager'
          data={customerInfo.payment_manager_id}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Receivable Days' data={mockData.receivableDays} labelSpan={10} dataSpan={14} />
        <LabelWithData
          label='OnBoarded By'
          data={customerInfo.onboarded_by_id}
          labelSpan={10}
          dataSpan={14}
        />
      </Col>
      <Col xs={24} sm={24} md={12}>
        <LabelWithData
          label='Company Type'
          data={customerInfo.type_id}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
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
          labelSpan={10} dataSpan={14}
        />
        <LabelWithData
          label='Advance %'
          data={customerInfo.advance_percentage_id}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Exception Date'
          data={customerInfo.exception_date}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Credit Limit'
          data={<InlineEdit text={value.credit_limit} objKey='creditLimit' onSetText={onSubmit} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Payment Pending' data={mockData.paymentPending} labelSpan={10} dataSpan={14} />
        <LabelWithData label='System Mamul' data={mockData.systemMamul} labelSpan={10} dataSpan={14} />
      </Col>
    </Row>
  )
}

export default CustomerInfo
