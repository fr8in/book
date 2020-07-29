import { useState } from 'react'
import { Space } from 'antd'
import { CheckCircleOutlined, CrownFilled } from '@ant-design/icons'
import PartnerUsers from '../../components/partners/partnerUsers'
import data from '../../../mock/partner/partner'
import PartnerName from './partnerName'

const PartnerInfo = (props) => {
  const { partner } = props
  const usersInitial = { users: [], name: '', visible: false }
  const [users, setUsers] = useState(usersInitial)

  const usersClose = () => {
    setUsers(usersInitial)
  }

  const showUsers = (record) => {
    setUsers({ ...users, users: record.users, name: record.name, visible: true })
  }
 const membership = partner.partner_memberships &&  partner.partner_memberships.length > 0 && 
                    partner.partner_memberships[0].membership_type && 
                    partner.partner_memberships[0].membership_type.id
 const number = partner.partner_users && partner.partner_users[0].mobile ? partner.partner_users[0].mobile : '-'
 return (
    <div>
      <Space>
        <CrownFilled style={{ color: membership ? '#FFD700' : '#C0C0C0', fontSize: '18px' }} />
        <CheckCircleOutlined style={{ color: data.kycStatus === 'Verified' ? '#28a745' : '#dc3545', fontSize: '18px' }} />
        <PartnerName cardcode={partner.cardcode} name={partner.name} />
        <h3> {partner.cardcode} </h3>
        <h3 className='link' onClick={() => showUsers(data)}>{number}</h3>
      </Space>
      {users.visible &&
        <PartnerUsers
          visible={users.visible}
          data={users.users}
          onHide={usersClose}
          name={users.name}
        />}
    </div>
  )
}

export default PartnerInfo
