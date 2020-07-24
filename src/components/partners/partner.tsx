import { useState } from 'react'
import { Space, Divider } from 'antd'
import { CheckCircleOutlined, CrownFilled } from '@ant-design/icons'
import PartnerUsers from '../../components/partners/partnerUsers'
import data from '../../../mock/partner/partner'

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

  return (
    <div>
      <Space align='baseline'>
        <CrownFilled style={{ color: data.membership ? '#FFD700' : '#C0C0C0', fontSize: '18px' }} />
        <CheckCircleOutlined style={{ color: data.kycStatus === 'Verified' ? '#28a745' : '#dc3545', fontSize: '18px' }} />
        <h2>{partner.name}</h2>
        <Divider type='vertical' />
        <h3>{data.code}</h3>
        <h3 className='link' onClick={() => showUsers(data)}>{data.number}</h3>
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
