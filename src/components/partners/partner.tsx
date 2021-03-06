import { Space, Button, Tooltip, Avatar ,Badge} from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, CheckCircleOutlined, MinusOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import PartnerUsers from '../../components/partners/partnerUsers'
import PartnerName from './partnerName'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import get from 'lodash/get'
import u from '../../lib/util'
import Phone from '../common/phone'
import React from 'react'

const PartnerInfo = (props) => {
  const { partner, loading } = props
  const usersInitial = { partner: [], title: '', visible: false }
  const { object, handleHide, handleShow } = useShowHidewithRecord(usersInitial)

  const partner_membership = get(partner, 'partner_membership_targets[0]', null)
  const number = get(partner, 'partner_users[0].mobile', null)
  const partner_id = get(partner, 'id', null)
  const partnerKycStatus = get(partner, 'partner_status.id', null)
  const partnerStatusName = get(partner, 'partner_status.name', null)
  const active_category_id =  get(partner, 'active_category_id', null)
  const count = (active_category_id === 2) ?<Avatar  style={{ backgroundColor: '#3b7ddd',fontSize: '7px' ,top: '-7px',right:'-20px',height:'12px',width:'12px',lineHeight:'12px'}} icon={<PlusOutlined />} /> : (active_category_id === 3) ?<Avatar  style={{ backgroundColor: '#28a745',fontSize: '7px' ,top: '-7px',right:'-20px',height:'12px',width:'12px',lineHeight:'12px'}} icon={<ArrowUpOutlined/>}/> : (active_category_id === 4) ? <Avatar  style={{ backgroundColor: '#fd7e14',fontSize: '7px' ,top: '-7px',right:'-20px',height:'12px',width:'12px',lineHeight:'12px'}} icon={<ArrowDownOutlined/>}/>  : (active_category_id === 5) ? <Avatar  style={{ fontSize: '7px' ,top: '-7px',right:'-20px',height:'12px',width:'12px',lineHeight:'12px'}} /> : (active_category_id === 6) ? <Avatar icon={<MinusOutlined />} style={{ fontSize: '7px' ,top: '-7px',right:'-20px',height:'12px',width:'12px',lineHeight:'12px',backgroundColor:'#dc3545'}} /> : null

  return (
    <>
      <Space align='center'>
        <Phone number={number} icon={true} />
        <Tooltip title={partnerStatusName}>
          <CheckCircleOutlined
            style={{
              color: partnerKycStatus === 4 ? '#28a745' : '#dc3545',
              fontSize: '18px'
            }}
          />
        </Tooltip>
        <Badge  count={count} />
        <PartnerName
          cardcode={partner.cardcode}
          name={partner.name}
          partner_id={partner.id}
          loading={loading}
        />
        <h4>{partner.cardcode}</h4>
        <h4>{number}</h4>
        <Button
          shape='circle'
          size='small'
          icon={<UserOutlined />}
          onClick={() => handleShow('visible', partner.name, 'partner', partner)}
        />
        <h4>{`A:${u.convertToLakhs(get(partner_membership, 'actual.gmv'))}
              G:${u.convertToLakhs(get(partner_membership, 'gold', 0))}
              P:${u.convertToLakhs(get(partner_membership, 'platinum', 0))}
              T:${get(partner_membership, 'transaction_fee', 0)}
              C:${get(partner_membership, 'cash_back_amount', 0)}
              `}
        </h4>
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
