import { useContext } from 'react'
import { EditTwoTone } from '@ant-design/icons'
import userContext from '../../lib/userContaxt'
import isEmpty from 'lodash/isEmpty'

const EditAccess = (props) => {
  const { edit_access, onEdit } = props
  const context = useContext(userContext)
  const access = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false

  console.log('access', access)
  return (
    <>
      {access ? <EditTwoTone onClick={onEdit} /> : ''}
    </>
  )
}

export default EditAccess
