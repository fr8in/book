import { useState } from 'react'
import { Row, Col, Checkbox, Space, Button } from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import data from '../../../mock/customer/customerDetail'
import LabelWithData from '../common/labelWithData'
import InlineEdit from '../common/inlineEdit'

const CustomerInfo = () => {
  const initial = {
    gst: data.gst,
    region: data.region,
    paymentManager: data.paymentManager,
    onBoardedBy: data.onBoardedBy,
    companyType: data.companyType,
    advancePercentage: data.advancePercentage,
    advException: data.advanceException,
    finalException: data.finalPaymentException,
    creditLimit: data.creditLimit,
    managed: data.managed === 'Yes'
  }
  const [value, setValue] = useState(initial)
  const editSubmit = (objKey, text) => {
    setValue({ ...value, [objKey]: text })
  }
  const textChangeHandle = (objKey, text) => {
    setValue({ ...value, [objKey]: text })
  }
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`)
    setValue({ ...value, managed: e.target.checked })
  }
  return (
    <Row>
      <Col xs={24} sm={24} md={12}>
        <LabelWithData
          label='PAN'
          data={
            <Space>
              <span>{data.pan}</span>
              {data.panUrl
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
              {data.lrUrl
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
        <LabelWithData label='BP Code' data={data.cartCode} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Virtual Account' data={data.virtualAccount} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Mobile No' data={data.mobileNo} labelSpan={10} dataSpan={14} />
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
        <LabelWithData label='Receivable Days' data={data.receivableDays} labelSpan={10} dataSpan={14} />
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
        <LabelWithData label='Payment Pending' data={data.paymentPending} labelSpan={10} dataSpan={14} />
        <LabelWithData label='System Mamul' data={data.systemMamul} labelSpan={10} dataSpan={14} />
      </Col>
    </Row>
  )
}

export default CustomerInfo
