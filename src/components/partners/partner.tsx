import { Space, Button } from 'antd'
import { CheckCircleOutlined, CrownFilled, UserOutlined } from '@ant-design/icons'
import PartnerUsers from '../../components/partners/partnerUsers'
import PartnerName from './partnerName'
import PartnerUser from './partnerUserNumber'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'

const PartnerInfo = (props) => {
  const { partner } = props
  console.log('partner', partner)
  const usersInitial = { partner: [], title: '', visible: false }
  const { object, handleHide, handleShow } = useShowHidewithRecord(usersInitial)

  const membership = partner.partner_memberships && partner.partner_memberships.length > 0 &&
                    partner.partner_memberships[0].membership_type &&
                    partner.partner_memberships[0].membership_type.id
  const number = partner.partner_users[0] && partner.partner_users[0].mobile ? partner.partner_users[0].mobile : '-'
  return (
    <div>
      <Space align='center'>
        <CrownFilled style={{ color: membership ? '#FFD700' : '#C0C0C0', fontSize: '18px' }} />
        <CheckCircleOutlined style={{ color: partner.partner_status && partner.partner_status.id === 2 ? '#28a745' : '#dc3545', fontSize: '18px' }} />
        <PartnerName cardcode={partner.cardcode} name={partner.name} />
        <h4>{partner.cardcode}</h4>
        <h4><PartnerUser mobile={number} /></h4>
        <Button shape='circle' size='small' icon={<UserOutlined />} onClick={() => handleShow('visible', partner.name, 'partner', partner)} />
      </Space>
      {object.visible &&
        <PartnerUsers
          visible={object.visible}
          partner={object.partner}
          onHide={handleHide}
          title={object.title}
        />}
    </div>
  )
}

export default PartnerInfo
