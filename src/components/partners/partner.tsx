import { Space, Button, Tooltip } from 'antd'
import { CheckCircleOutlined, CrownFilled, UserOutlined } from '@ant-design/icons'
import PartnerUsers from '../../components/partners/partnerUsers'
import PartnerName from './partnerName'
import PartnerUser from './partnerUserNumber'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import get from 'lodash/get'
import u from '../../lib/util'

const PartnerInfo = (props) => {
  const { partner, loading } = props
  const usersInitial = { partner: [], title: '', visible: false }
  const { object, handleHide, handleShow } = useShowHidewithRecord(usersInitial)

  const membership = get(partner, 'partner_memberships[0].membership_type.id', null)
  const number = get(partner, 'partner_users[0].mobile', null)
  const partner_id = get(partner, 'id', null)
  const partnerKycStatus = get(partner, 'partner_status.id', null)
  const partnerStatusName = get(partner, 'partner_status.name', null)
  console.log('membership', membership)
  return (
    <>
      <Space align='center'>
        <Tooltip title={u.membership(membership)}>
          <CrownFilled
            style={{
              color: u.membership_color(membership),
              fontSize: '18px'
            }}
          />
        </Tooltip>
        <Tooltip title={partnerStatusName}>
          <CheckCircleOutlined
            style={{
              color: partnerKycStatus === 4 ? '#28a745' : '#dc3545',
              fontSize: '18px'
            }}
          />
        </Tooltip>
        <PartnerName
          cardcode={partner.cardcode}
          name={partner.name}
          loading={loading}
        />
        <h4>{partner.cardcode}</h4>
        <h4><PartnerUser mobile={number} loading={loading} id={partner_id} /></h4>
        <Button
          shape='circle'
          size='small'
          icon={<UserOutlined />}
          onClick={() => handleShow('visible', partner.name, 'partner', partner)}
        />
      </Space>

      {object.visible &&
        <PartnerUsers
          visible={object.visible}
          partner={object.partner}
          onHide={handleHide}
          title={object.title}
        />}
    </>
  )
}

export default PartnerInfo
