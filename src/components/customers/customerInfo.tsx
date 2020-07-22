import { useState } from 'react'
import { Row, Col, Checkbox, Space, Button } from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import InlineEdit from '../common/inlineEdit'
import LabelWithData from '../common/labelWithData'

import mockData from '../../../mock/customer/customerDetail'

const CustomerInfo = (props) => {
  const { customerInfo } = props
  const initial = {
    GSTNo: customerInfo.GSTNo,
    creditLimit: customerInfo.creditLimit,
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
              <span>{customerInfo.PAN}</span>
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
          data={<InlineEdit text={value.GSTNo} objKey='GSTNo' onSetText={onSubmit} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='BP Code' data={customerInfo.cardCode} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Virtual Account' data={customerInfo.virtualAccount} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Mobile No' data={customerInfo.mobileNo} labelSpan={10} dataSpan={14} />
        <LabelWithData
          label='Region'
          data={mockData.region}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Payment Manager'
          data={customerInfo.paymentManagerId}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Receivable Days' data={mockData.receivableDays} labelSpan={10} dataSpan={14} />
        <LabelWithData
          label='OnBoarded By'
          data={customerInfo.onboardedById}
          labelSpan={10}
          dataSpan={14}
        />
      </Col>
      <Col xs={24} sm={24} md={12}>
        <LabelWithData
          label='Company Type'
          data={customerInfo.typeId}
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
          data={customerInfo.advancePercentageId}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Exception Date'
          data={customerInfo.exceptionDate}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Credit Limit'
          data={<InlineEdit text={value.creditLimit} objKey='creditLimit' onSetText={onSubmit} />}
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
