import { Modal, Button, Input, Row, Form, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import { useContext } from 'react'
import userContext from '../../lib/userContaxt'
import { useState } from 'react'

const INSERT_ANNOUNCEMENT_MUTATION = gql`
mutation create_announcement($title: String, $description: String, $createdBy: String, $createdAt: timestamp) {
    insert_announcement(objects: {title: $title, description: $description, createdby: $createdBy, createdat: $createdAt}) {
      returning {
        id
        title
        description
        deleted
        updatedat
        createdat
        createdby
      }
    }
  }
`
const CreateAnnouncenment = (props) => {
  const { visible, onHide } = props
  const context = useContext(userContext)
  const [disableButton, setDisableButton] = useState(false)

  const [updateAnnouncement] = useMutation(
    INSERT_ANNOUNCEMENT_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
         message.error(error.toString()) },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        onHide()
      }
    }
  )

  const onChange = (form) => {
    setDisableButton(true)
    updateAnnouncement({
      variables: {
        title: form.title,
        createdBy: context.email,
        description: form.description,
        createdAt: 'now'
      }
    })
  }

  return (
    <Modal
      title='Create an Announcement'
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
      <Form layout='vertical' onFinish={onChange}>
        <Form.Item label='Title' name='title'>
          <Input placeholder='Title' />
        </Form.Item>
        <Form.Item label='Description' name='description'>
          <Input.TextArea placeholder='Description' />
        </Form.Item>
        <Row justify='end'>
          <Button type='primary' key='submit' loading={disableButton} htmlType='submit'>Publish</Button>
        </Row>
      </Form>
    </Modal>
  )
}
export default CreateAnnouncenment
