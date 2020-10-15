import { useState } from 'react'
import { Button, message, Modal } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'

const FILE_DOWNLOAD_MUTATION = gql`
  mutation file_downlod($name:String,$folder:String) {
    fileDownload(name: $name, folder: $folder) {
        url
     }
    }
  `

const ViewFile = (props) => {
  const { folder, file_type, file_list, size } = props
  const file = file_list && file_list.length > 0 ? file_list[0].file_path : null
  const previewInitial = { visible: false, image: '', title: '', ext: '' }
  const [preview, setPreview] = useState(previewInitial)

  const [s3FilePreview] = useMutation(
    FILE_DOWNLOAD_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const url = data && data.fileDownload && data.fileDownload.url
        console.log('url', url)
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

  const handleCancel = () => setPreview(previewInitial)

  const onPreview = (file) => {
    if (!file) {
      message.error(`There is NO ${file_type} file to View!!`)
    } else {
      const ext = file.split(/[\s.]+/)
      setPreview({ ...preview, ext: ext[ext.length - 1] })

      const variables = { name: file, folder: folder }
      s3FilePreview({
        variables: variables
      })
    }
  }

  return (
    <>
      <Button shape='circle' size={size || 'default'} icon={<EyeOutlined />} onClick={() => onPreview(file)} />
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

export default ViewFile
