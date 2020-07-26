import { Row } from 'antd'
import LabelAndData from '../common/labelAndData'
import detail from '../../../mock/partner/partnerInfo'

const PartnerInfo = (props) => {
  const { partnerInfo } = props

  console.log('partnerInfo', partnerInfo)

  return (
    <Row gutter={8} className='mb10'>
      <LabelAndData
        label='Pan'
        data={<label>{partnerInfo.pan}</label>}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='City'
        data={<label>{partnerInfo.city.name}</label>}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='Region'
        data={<label>{detail.region}</label>}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='On Boarded By'
        data={<label>{partnerInfo.onboarded_by.name}</label>}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
    </Row>
  )
}

export default PartnerInfo
