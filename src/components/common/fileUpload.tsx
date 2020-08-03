// import {useState}  from 'react'
import { useState } from 'react'
import { Row, Col, Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
// import fetch from 'isomorphic-fetch'

const fil = 'Screen Shot 2020-02-08 at 2.57.32 PM.png2020_07_26_18_50_31'
const tripId = 2

const FileUpload = (props) => {
  const { type, trip_id, folder, file_type, file_list } = props
  const [base64Str, setBase64Str] = useState(null)
  const [names, setNames] = useState(null)
  const [path, setPath] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const disabledUpload = !file

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
    mutation($name:String,$id:Int,$type: String) {
    fileDelete(name: $name,id:$id, type:$type) {
        affected
        }
    }
    `

  const [s3FileUpload] = useMutation(
    FILE_UPLOAD_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const fileUpload = (name) => {
    setLoading(true)
    const variables = { name: name, type: type, base64Str: base64Str, id: trip_id, folder: folder, fileType: file_type }
    s3FileUpload({
      variables: variables
    })
  }

  const onChange = (e) => {
    const reader = new FileReader()
    if (e) {
      reader.readAsBinaryString(e)
    }
    reader.onload = function () {
      // @ts-ignore
      const base64Str = btoa(reader.result)
      setBase64Str(base64Str)
    }
    reader.onerror = function () {
      console.log('unable to parse file')
    }
    setNames(e.name)
    setFile(e.name)
    return false
  }

  const download = (file) => {
    const variables = { name: file.name, folder: folder }
    const url = 'http://prodcore.southeastasia.azurecontainer.io/v1/graphql'
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: FILE_DOWNLOAD_MUTATION,
        variables: variables
      })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res.errors) {
          alert('Something went wrong')
        } else {
          setPath(res.data.fileDownload.url)
          console.log('path', path)
          window.open(res.data.fileDownload.url, '_blank')
        }
      })
  }

  const remove = (file) => {
    console.log(file)
    const variables = { name: file.name, id: tripId, type: type }
    const url = 'http://prodcore.southeastasia.azurecontainer.io/v1/graphql'
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: FILE_DELETE_MUTATION,
        variables: variables
      })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res.errors) {
          alert('Something went wrong')
        } else {
          const affected = res.data.fileDelete.affected
          if (affected) {
            message.success('File deleted successfully')
          }
        }
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
          accept='image/jpeg, image/jpg, image/png'
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
          type='primary'
          // disabled
          style={{ marginTop: 10 }}
          onClick={() => fileUpload(names)}
          disabled={disabledUpload}
          loading={loading}
        >
          {loading ? 'uploading' : 'Start Upload'}
        </Button>
      </Col>
    </Row>
  )
}

export default FileUpload
