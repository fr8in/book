import { Row, Col } from 'antd'
import LabelWithData from '../common/labelWithData'
import detail from '../../../mock/partner/partnerInfo'

const PartnerInfo = () => {
  return (
    <Row gutter={8} className='mb10'>
      <Col xs={24} sm={24} md={24}>
        <LabelWithData
          label='City'
          data={detail.city}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Region'
          data={detail.region}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='On Boarded By'
          data={detail.onBoardedBy}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Amount'
          data={detail.amount}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Advance Percentage'
          data={detail.advance}
          labelSpan={10}
          dataSpan={14}
        />
      </Col>
    </Row>
  )
}

export default PartnerInfo
