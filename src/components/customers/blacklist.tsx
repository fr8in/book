import { gql, useMutation } from '@apollo/client'
import { Switch, Tooltip, message } from 'antd'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import useShowHide from '../../hooks/useShowHide'
import isEmpty from 'lodash/isEmpty'
import BlacklistComment from '../customers/blacklistComment'


// This has to go to global
const customerStatus = {
  Blacklisted: 6,
  Active: 1
}

const Blacklist = ({ customer_info, statusId, edit_access }) => {
  const initial = { blacklist: false}
  const { visible, onShow, onHide } = useShowHide(initial)
  const context = useContext(userContext)
  const access = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false

  const blacklisted = statusId === customerStatus.Blacklisted

  return (
    <> {
    access ? (
      <Tooltip title={blacklisted ? 'Unblacklist' : 'Blacklist'}>
        <Switch
        onClick={() => onShow('blacklist')}
          checked={blacklisted}
          className={blacklisted ? 'block' : 'unblock'}
          disabled={false}
        />
      </Tooltip> ) : null }
       {visible.blacklist && <BlacklistComment visible={visible.blacklist} onHide={onHide} customer_info={customer_info} blacklisted={blacklisted}  status={status}/>}
       </>
      
  )
}

export default Blacklist
