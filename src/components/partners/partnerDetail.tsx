import { Row, Col, Space } from 'antd'
import LabelWithData from '../common/labelWithData'
import DetailInfo from '../../../mock/partner/partnerDetailInfo'

const PartnerDetail = (props) => {
  const { partnerDetail } = props

  console.log('partnerDetail', partnerDetail)

  return (
    <Row gutter={8}>
      <Col xs={24} sm={24} md={24}>
        <LabelWithData
          label='PAN'
          data={partnerDetail.pan}
          labelSpan={10}
          dataSpan={14}
        />
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
          data={<span>{partnerDetail.bank.name}</span>}
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
