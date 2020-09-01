import { Modal, Button, Input, Row, Form, message } from 'antd'
 import { gql, useMutation } from '@apollo/client'

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

    const [updateAnnouncement] = useMutation(
        INSERT_ANNOUNCEMENT_MUTATION,
        {
          onError (error) { message.error(error.toString()) },
          onCompleted () {
            message.success('Updated!!')
          }
        }
      )
    
      const onChange = (form) => {
        console.log('inside form submit', form)
        updateAnnouncement({
          variables: {
            title: form.title,
            createdBy: 'karthi@fr8.in',
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
            footer={null}
        >
            <Form layout='vertical'  onFinish={onChange} >
                <Form.Item
                    label='Title' name='title'
                >
                    <Input placeholder='Title' />
                </Form.Item>
                <Form.Item
                    label='Description' name='description'
                >
                    <Input.TextArea placeholder=' Description' />
                </Form.Item>
                <Row justify='end'>
                <Button  key='back' > Cancel </Button> &nbsp;
                    <Button type='primary' htmlType='submit'> Publish </Button>
                </Row>
            </Form>
        </Modal>
    )
}
export default CreateAnnouncenment