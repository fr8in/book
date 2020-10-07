import { useContext } from 'react'
import { EditTwoTone } from '@ant-design/icons'
import userContext from '../../lib/userContaxt'

const EditAccess = (props) => {
  const { edit_access, onEdit } = props
  const context = useContext(userContext)
  const access = context.roles.some(r => edit_access.includes(r))

  console.log('access', access)
  return (
    <>
      {access ? <EditTwoTone onClick={onEdit} /> : ''}
    </>
  )
}

export default EditAccess
