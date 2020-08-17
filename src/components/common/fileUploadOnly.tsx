import { useState } from 'react'
import { Upload, Button, message, Modal } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'

const FILE_UPLOAD_MUTATION = gql`
  mutation file_upload($name: String, $type: String, $base64Str: String,$id: Int, $folder: String,$fileType: String ) {
    fileUpload(name: $name, type: $type, base64Str: $base64Str, id: $id, folder: $folder, fileType: $fileType) {
      file_path
    }
  }
`

const FILE_DOWNLOAD_MUTATION = gql`
  mutation file_download($name:String,$folder:String) {
    fileDownload(name: $name, folder: $folder) {
        url
     }
    }
  `

const FILE_DELETE_MUTATION = gql`
    mutation file_delete($name:String,$id:Int,$type: String, $fileType: String) {
    fileDelete(name: $name,id:$id, type:$type, fileType: $fileType) {
        affected
        }
    }
    `

const FileUploadOnly = (props) => {
  const { type, id, folder, file_type, file_list, disable } = props

  const previewInitial = { visible: false, image: '', title: '', ext: '' }
  const [preview, setPreview] = useState(previewInitial)

  let base64Str = null
  const [s3FileUpload] = useMutation(
    FILE_UPLOAD_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
        base64Str = null
      }
    }
  )

  const [s3FilePreview] = useMutation(
    FILE_DOWNLOAD_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const url = data && data.fileDownload && data.fileDownload.url
        if (preview.ext === 'pdf') {
          window.open(url, '_blank')
        } else {
          setPreview({
            ...preview,
            image: url,
            visible: true,
            title: `${file_type.toUpperCase()} Preview`
          })
        }
      }
    }
  )

  const [s3FileDelete] = useMutation(
    FILE_DELETE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Deleted!!') }
    }
  )

  const handleCancel = () => setPreview(previewInitial)

  const getBase64 = (file) => {
    const reader = new FileReader()
    if (file) {
      reader.readAsBinaryString(file)
    }
    reader.onload = function () {
      // @ts-ignore
      const baseStr = btoa(reader.result)
      base64Str = baseStr
    }
    reader.onerror = function () {
      console.log('unable to parse file')
    }
    return false
  }

  const fileUpload = (data) => {
    const file_name = data.file.name
    setTimeout(() => {
      const variables = { name: file_name, type: type, base64Str: base64Str, id: id, folder: folder, fileType: file_type }
      s3FileUpload({
        variables: variables
      })
    }, 1000)
  }

  const download = (file) => {
    const ext = file.name.split(/[\s.]+/)
    setPreview({ ...preview, ext: ext[ext.length - 1] })

    const variables = { name: file.name, folder: folder }
    s3FilePreview({
      variables: variables
    })
  }

  const remove = (file) => {
    console.log(file)
    const variables = { name: file.name, id: id, type: type, fileType: file_type }
    s3FileDelete({
      variables: variables
    })
  }

  return (
    <>
      <Upload
        beforeUpload={getBase64}
        accept='image/*, application/pdf'
        fileList={file_list || []}
        onChange={fileUpload}
        className='file-upload'
        onPreview={file_list ? (file) => download(file) : () => {}}
        onRemove={file_list ? (file) => remove(file) : () => {}}
      >
        <Button shape='circle' type='primary' icon={<UploadOutlined />} disabled={disable} />
      </Upload>
      {preview.visible &&
        <Modal
          visible={preview.visible}
          title={preview.title}
          footer={null}
          onCancel={handleCancel}
          bodyStyle={{ padding: 10 }}
          style={{ top: 20 }}
          width={800}
        >
          <img alt={file_type} style={{ width: '100%' }} src={preview.image} />
        </Modal>}
    </>
  )
}

export default FileUploadOnly
