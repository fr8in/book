import { Button, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'

const FILE_DELETE_MUTATION = gql`
mutation delete_file($name: String, $id: Int, $type: String, $fileType: String,$updated_by:String) {
  fileDelete(name: $name, id: $id, type: $type, fileType: $fileType,updated_by:$updated_by) {
    affected
  }
}
`

const DeleteFile = (props) => {
  const { type, id, file_type, file_list, size, disable } = props
  const file = file_list && file_list.length > 0 ? file_list[0].file_path : null
  const context = useContext(userContext)


  const [s3FileDelete] = useMutation(
    FILE_DELETE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Deleted!!') }
    }
  )

  const remove = (file) => {
    const variables = { name: file, id: id, type: type, fileType: file_type,updated_by: context.email }
    if (!file) {
      message.error(`There is NO ${file_type} file to Delete!!`)
    } else {
      s3FileDelete({
        variables: variables
      })
    }
  }

  return (
    <Button shape='circle' size={size || 'default'} danger icon={<DeleteOutlined />} onClick={() => remove(file)} disabled={disable} />
  )
}

export default DeleteFile
