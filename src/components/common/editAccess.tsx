import { useContext } from 'react'
import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import userContext from '../../lib/userContaxt'
import isEmpty from 'lodash/isEmpty'

const EditAccess = (props) => {
  const { edit_access, onEdit, lock, disable } = props
  const context = useContext(userContext)
  const access = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false

  return (
    <>
      {access && !lock ? (
        <Button onClick={onEdit} type='link' size='small' disabled={disable}>
          <EditOutlined />
        </Button>) : ''}
    </>
  )
}

export default EditAccess
