import { Space, Button } from 'antd'
import { CheckCircleOutlined, CrownFilled, UserOutlined } from '@ant-design/icons'
import PartnerUsers from '../../components/partners/partnerUsers'
import PartnerName from './partnerName'
import PartnerUser from './partnerUserNumber'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import get from 'lodash/get'

const PartnerInfo = (props) => {
  const { partner, loading } = props
  const usersInitial = { partner: [], title: '', visible: false }
  const { object, handleHide, handleShow } = useShowHidewithRecord(usersInitial)

  const membership = get(partner, 'partner_memberships[0].membership_type.id', null)
  const number = get(partner, 'partner_users[0].mobile', null)
  const id = get(partner, 'partner_users[0].id', null)
  const partnerKycStatus = get(partner, 'partner_status.id', null)
  console.log('partner', partner)
  return (
    <>
      <Space align='center'>
        <CrownFilled
          style={{
            color: membership === 1 ? '#C0C0C0' : membership === 2 ? '#FFD700' : '#97b9ff',
            fontSize: '18px'
          }}
        />
        <CheckCircleOutlined
          style={{
            color: partnerKycStatus === 2 ? '#28a745' : '#dc3545',
            fontSize: '18px'
          }}
        />
        <PartnerName
          cardcode={partner.cardcode}
          name={partner.name}
          loading={loading}
        />
        <h4>{partner.cardcode}</h4>
        <h4><PartnerUser mobile={number} loading={loading} id={id} /></h4>
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
