import { Row } from 'antd'
import LabelAndData from '../common/labelAndData'
import PartnerOnBoardedBy from './partnerOnboardedByName'

const PartnerInfo = (props) => {
  const { partnerInfo } = props

  console.log('partnerInfo', partnerInfo)

  return (
    <Row gutter={8} className='mb10'>
      <LabelAndData
        label='City'
        data={<label>{partnerInfo.city && partnerInfo.city.name}</label>}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='Region'
        data={<label>{partnerInfo.city && partnerInfo.city.branch &&
           partnerInfo.city.branch.region && partnerInfo.city.branch.region.name }</label>}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='On-Boarded'
        data={
          <PartnerOnBoardedBy
          onboardedBy={partnerInfo.onboarded_by && partnerInfo.onboarded_by.email}
          onboardedById={partnerInfo.onboarded_by && partnerInfo.onboarded_by.id}
          cardcode={partnerInfo.cardcode}
        />
        }
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
    </Row>
  )
}

export default PartnerInfo
