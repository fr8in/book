import { Row, Col, Space, Button } from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import LabelWithData from '../common/labelWithData'

import mockData from '../../../mock/customer/customerDetail'
import CustomerGst from './customerGst'

const CustomerDetails = (props) => {
  const { customer_info } = props

  return (
    <Row gutter={8}>
      <Col xs={24} sm={24} md={12}>
        <LabelWithData
          label='PAN'
          data={
            <Space>
              <span>{customer_info.pan}</span>
              {customer_info.panUrl
                ? <Button type='primary' shape='circle' icon={<DownloadOutlined />} size='small' />
                : <Button shape='circle' icon={<UploadOutlined />} size='small' />}
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='GST No'
          data={<CustomerGst gst={customer_info.gst} cardcode={customer_info.cardcode} loading={props.loading} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Virtual Account' data={customer_info.virtual_account} labelSpan={10} dataSpan={14} />
      </Col>
      <Col xs={24} sm={24} md={12}>
        <LabelWithData
          label='LR'
          data={
            <Space>
              {customer_info.lrUrl
                ? <Button type='primary' shape='circle' icon={<DownloadOutlined />} size='small' />
                : <Button shape='circle' icon={<UploadOutlined />} size='small' />}
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Mobile No' data={customer_info.mobile} labelSpan={10} dataSpan={14} />
        <LabelWithData
          label='OnBoarded By'
          data={customer_info.approved_by_id}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Receivable Days' data={mockData.receivableDays} labelSpan={10} dataSpan={14} />
      </Col>
    </Row>
  )
}

export default CustomerDetails
