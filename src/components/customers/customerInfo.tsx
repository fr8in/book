import { useState } from 'react'
import { Row, Col, Checkbox, Space, Button } from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import InlineEdit from '../common/inlineEdit'
import LabelWithData from '../common/labelWithData'

import mockData from '../../../mock/customer/customerDetail'

const CustomerInfo = (props) => {
  const { customerInfo } = props
console.log('props', props)
  const initial = {
    gst: mockData.gst,
    region: mockData.region,
    paymentManager: mockData.paymentManager,
    onBoardedBy: mockData.onBoardedBy,
    companyType: mockData.companyType,
    advancePercentage: mockData.advancePercentage,
    advException: mockData.advanceException,
    finalException: mockData.finalPaymentException,
    creditLimit: mockData.creditLimit,
    managed: mockData.managed === 'Yes'
  }
  const [value, setValue] = useState(initial)

  const editSubmit = (objKey, text) => {
    setValue({ ...value, [objKey]: text })
  }

  const textChangeHandle = (objKey, text) => {
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
          data={<InlineEdit text={value.gst} objKey='gst' onSetText={text => textChangeHandle('gst', text)} onSubmit={editSubmit} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='BP Code' data={customerInfo.cardCode} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Virtual Account' data={mockData.virtualAccount} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Mobile No' data={customerInfo.mobileNo} labelSpan={10} dataSpan={14} />
        <LabelWithData
          label='Region'
          data={<InlineEdit text={value.region} objKey='region' onSetText={text => textChangeHandle('region', text)} onSubmit={editSubmit} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Payment Manager'
          data={<InlineEdit text={value.paymentManager} objKey='paymentManager' onSetText={text => textChangeHandle('paymentManager', text)} onSubmit={editSubmit} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Receivable Days' data={mockData.receivableDays} labelSpan={10} dataSpan={14} />
        <LabelWithData
          label='OnBoarded By'
          data={<InlineEdit text={value.onBoardedBy} objKey='onBoardedBy' onSetText={text => textChangeHandle('onBoardedBy', text)} onSubmit={editSubmit} />}
          labelSpan={10}
          dataSpan={14}
        />
      </Col>
      <Col xs={24} sm={24} md={12}>
        <LabelWithData
          label='Company Type'
          data={<InlineEdit text={value.companyType} objKey='companyType' onSetText={text => textChangeHandle('companyType', text)} onSubmit={editSubmit} />}
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
          data={<InlineEdit text={value.advancePercentage} objKey='advancePercentage' onSetText={text => textChangeHandle('advancePercentage', text)} onSubmit={editSubmit} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Advance Exception'
          data={<InlineEdit text={value.advException} objKey='advException' onSetText={text => textChangeHandle('advException', text)} onSubmit={editSubmit} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Final Payment Exception'
          data={<InlineEdit text={value.finalException} objKey='finalException' onSetText={text => textChangeHandle('finalException', text)} onSubmit={editSubmit} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Credit Limit'
          data={<InlineEdit text={value.creditLimit} objKey='creditLimit' onSetText={text => textChangeHandle('creditLimit', text)} onSubmit={editSubmit} />}
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
