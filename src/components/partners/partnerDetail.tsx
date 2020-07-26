import { Row, Col, Space, Checkbox, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import LabelWithData from '../common/labelWithData'
import DetailInfo from '../../../mock/partner/partnerDetailInfo'

const PartnerDetail = (props) => {
  const { partnerDetail } = props

  console.log('partnerDetail', partnerDetail)
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`)
  }
  return (
    <Row gutter={8}>
      <Col xs={24} sm={24} md={24}>
        <LabelWithData
          label='On Boarded Date'
          data={
            <Space>
              <span>{partnerDetail.onboarded_date}</span>
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Email'
          data={
            <Space>
              <span>{DetailInfo.mail}</span>
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='No.Of Trucks'
          data={
            <Space>
              <span>{DetailInfo.truck}</span>
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' Address'
          data={
            <Space>
              <span>{partnerDetail.address}</span>
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='State'
          data={<span>{DetailInfo.state}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Bank'
          data={<span>{partnerDetail.bank_id}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Account Number '
          data={<span>{partnerDetail.account_number}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='IFSC Code'
          data={<span>{partnerDetail.ifsc_code}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Cibil Score '
          data={<span>{partnerDetail.cibil}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='EMI'
          data={<Checkbox onChange={onChange} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' TDS %'
          data={<span>{DetailInfo.TDS}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' GST'
          data={<span>{partnerDetail.gst}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Mapped Customers '
          data={
            <Tag style={{ borderStyle: 'dashed' }}>
              <PlusOutlined /> Add Customer
            </Tag>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Advance Percentage'
          data={partnerDetail.partner_advance_percentage_id}
          labelSpan={10}
          dataSpan={14}
        />
      </Col>
    </Row>

  )
}

export default PartnerDetail
