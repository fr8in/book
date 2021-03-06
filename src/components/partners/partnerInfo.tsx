import { Row } from 'antd'
import LabelAndData from '../common/labelAndData'
import PartnerOnBoardedBy from './partnerOnboardedByName'
import get from 'lodash/get'
import u from '../../lib/util'


const PartnerInfo = (props) => {
  const { partnerInfo } = props
  const { role } = u
  const access = [role.admin, role.partner_manager, role.partner_support, role.onboarding]

  return (
    <Row gutter={8} className='mb10'>
      <LabelAndData
        label='City'
        data={<label>{get(partnerInfo, 'partner_connected_city.connected_city.cities[0].name', null)}</label>}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='Region'
        data={
          <label>{get(partnerInfo, 'partner_connected_city.connected_city.cities[0].branch.region.name', null)}
          </label>
        }
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='On-Boarded'
        data={
          <PartnerOnBoardedBy
            onboardedBy={get(partnerInfo, 'onboarded_by.email', '-')}
            onboardedById={get(partnerInfo, 'onboarded_by.id', null)}
            cardcode={partnerInfo.cardcode}
            partner_id={partnerInfo.id}
            edit_access={access}
          />
        }
        mdSpan={5}
        smSpan={8}
        xsSpan={12}
      />
    </Row>
  )
}

export default PartnerInfo
