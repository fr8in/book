import {useState} from 'react'
import { Row, Col } from 'antd'
import LabelWithData from '../common/labelWithData'
import detail from '../../../mock/partner/partnerInfo'

const PartnerInfo = (props) => {

  const { partnerInfo } = props
  
  console.log('partnerInfo',partnerInfo)

  return (
    <Row gutter={8} className='mb10'>
      <Col xs={24} sm={24} md={24}>
        <LabelWithData
          label='City'
          data={partnerInfo.city.name}
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
          data={partnerInfo.onboarded_by.name}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Final Payment Date'
          data={partnerInfo.final_payment_date}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Advance Percentage'
          data={partnerInfo.partner_advance_percentage_id}
          labelSpan={10}
          dataSpan={14}
        />
      </Col>
    </Row>
  )
}

export default PartnerInfo
