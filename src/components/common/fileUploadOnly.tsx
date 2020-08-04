import { useState } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'

const FILE_UPLOAD_MUTATION = gql`
  mutation ($name: String, $type: String, $base64Str: String,$id: Int, $folder: String,$fileType: String ) {
    fileUpload(name: $name, type: $type, base64Str: $base64Str, id: $id, folder: $folder, fileType: $fileType) {
      file_path
    }
  }
`

const FileUploadOnly = (props) => {
  const { type, id, folder, file_type } = props
  const [base64Str, setBase64Str] = useState(null)

  const [s3FileUpload] = useMutation(
    FILE_UPLOAD_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
      }
    }
  )

  const getBase64 = (file) => {
    console.log('file', file)
    let baseStr = null
    const reader = new FileReader()
    if (file) {
      reader.readAsBinaryString(file)
    }
    reader.onload = function () {
      // @ts-ignore
      baseStr = btoa(reader.result)
      setBase64Str(baseStr)
    }
    reader.onerror = function () {
      console.log('unable to parse file')
    }
    return false
  }

  const fileUpload = (data) => {
    const file_name = data.file.name
    const variables = { name: file_name, type: type, base64Str: base64Str, id: id, folder: folder, fileType: file_type }
    s3FileUpload({
      variables: variables
    })
  }

  return (
    <Upload
      beforeUpload={getBase64}
      accept='image/*, application/pdf'
      fileList={[]}
      onChange={fileUpload}
    >
      <Button shape='circle' type='primary' icon={<UploadOutlined />} />
    </Upload>
  )
}

export default FileUploadOnly
