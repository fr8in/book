import { gql, useMutation } from '@apollo/client'
import { Switch, Tooltip, message } from 'antd'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'
import isEmpty from 'lodash/isEmpty'


const UPDATE_CUSTOMER_BLACKLIST_MUTATION = gql`
mutation customer_blacklist($status_id:Int,$cardcode:String,$updated_by:String!) {
  update_customer(_set: {status_id: $status_id,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      status_id
    }
  }
}
`
// This has to go to global
const customerStatus = {
  Blacklisted: 6,
  Active: 1
}

const Blacklist = ({ cardcode, statusId,edit_access }) => {
  const context = useContext(userContext)
  const access = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false


  const [updateStatusId] = useMutation(
    UPDATE_CUSTOMER_BLACKLIST_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onChange = (checked) => {
    updateStatusId({
      variables: {
        cardcode,
        updated_by: context.email,
        status_id: checked ? customerStatus.Blacklisted : customerStatus.Active
      }
    })
  }

  const blacklisted = statusId === customerStatus.Blacklisted
  console.log('blacklist', statusId, blacklisted)
  return (
    access ?
    <Tooltip title={blacklisted ? 'Unblacklist' : 'Blacklist'}>
      <Switch
        onChange={onChange}
        checked={blacklisted}
        className={blacklisted ? 'block' : 'unblock'}
        disabled={false}
      />
    </Tooltip> 
    : null
  )
}

export default Blacklist
