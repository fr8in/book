import { useState } from 'react'
import { Row, Col, Upload, Button, message, Modal } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'

const FILE_UPLOAD_MUTATION = gql`
  mutation ($name: String, $type: String, $base64Str: String,$id: Int, $folder: String,$fileType: String ) {
    fileUpload(name: $name, type: $type, base64Str: $base64Str, id: $id, folder: $folder, fileType: $fileType) {
      file_path
    }
  }
`

const FILE_DOWNLOAD_MUTATION = gql`
  mutation ($name:String,$folder:String) {
    fileDownload(name: $name, folder: $folder) {
        url
     }
    }
  `

const FILE_DELETE_MUTATION = gql`
    mutation($name:String,$id:Int,$type: String, $fileType: String) {
    fileDelete(name: $name,id:$id, type:$type, fileType: $fileType) {
        affected
        }
    }
    `

const FileUpload = (props) => {
  const { type, id, folder, file_type, file_list, disable } = props
  const [base64Str, setBase64Str] = useState(null)
  const [names, setNames] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const previewInitial = { visible: false, image: '', title: '', ext: '' }
  const [preview, setPreview] = useState(previewInitial) 

  const [s3FileUpload] = useMutation(
    FILE_UPLOAD_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
        setLoading(false)
      },
      onCompleted () {
        message.success('Updated!!')
        setLoading(false)
        setFile(null)
        setBase64Str(null)
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

  const onChange = (file) => {
    const reader = new FileReader()
    if (file) {
      reader.readAsBinaryString(file)
    }
    reader.onload = function () {
      // @ts-ignore
      const base64Str = btoa(reader.result)
      setBase64Str(base64Str)
    }
    reader.onerror = function () {
      console.log('unable to parse file')
    }
    setNames(file.name)
    setFile(file.name)
    return false
  }

  const handleCancel = () => setPreview(previewInitial)

  const fileUpload = (name) => {
    setLoading(true)
    const variables = { name: name, type: type, base64Str: base64Str, id: id, folder: folder, fileType: file_type }
    s3FileUpload({
      variables: variables
    })
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
    <Row>
      <Col xs={24}>
        <Upload
          beforeUpload={onChange}
          fileList={file_list}
          onPreview={(file) => download(file)}
          onRemove={(file) => remove(file)}
          accept='image/*, application/pdf'
        >
          <Button icon={<UploadOutlined />} disabled={disable}>Select File</Button>
        </Upload>
        <Button
          type='primary'
          // disabled
          style={{ marginTop: 10 }}
          onClick={() => fileUpload(names)}
          disabled={!file}
          loading={loading}
        >
          {loading ? 'uploading' : 'Start Upload'}
        </Button>
      </Col>
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
    </Row>
  )
}

export default FileUpload
