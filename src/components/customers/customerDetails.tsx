import { useState } from 'react'
import { Row, Col, Space, Button } from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import InlineEdit from '../common/inlineEdit'
import LabelWithData from '../common/labelWithData'

import mockData from '../../../mock/customer/customerDetail'

const CustomerDetails = (props) => {
  const { customerInfo } = props
  const initial = {
    gst: customerInfo.gst,
    managed: customerInfo.managed
  }
  const [value, setValue] = useState(initial)

  const onSubmit = (objKey, text) => {
    setValue({ ...value, [objKey]: text })
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
          label='GST No'
          data={<InlineEdit text={value.gst ? value.gst : '-'} objKey='gst' onSetText={onSubmit} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Virtual Account' data={customerInfo.virtual_account} labelSpan={10} dataSpan={14} />
      </Col>
      <Col xs={24} sm={24} md={12}>
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
        <LabelWithData label='Mobile No' data={customerInfo.mobile} labelSpan={10} dataSpan={14} />
        <LabelWithData
          label='OnBoarded By'
          data={customerInfo.approved_by_id}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Receivable Days' data={mockData.receivableDays} labelSpan={10} dataSpan={14} />
      </Col>
    </Row>
  )
}

export default CustomerDetails
