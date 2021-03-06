
import { Modal, Button, Input } from 'antd'

const SendLoadingMemo = (props) => {
  const { visible, onHide } = props
  const submitEmail = () => {
    console.log('email submitted!')
  }
  return (
    <Modal
      title='Loading Memo Email'
      visible={visible}
      onCancel={onHide}
      footer={[
        <Button key='back' onClick={onHide}>Cancel</Button>,
        <Button key='submit' type='primary' onClick={submitEmail}>Send</Button>
      ]}
    >
      <Input placeholder='Email Address' />
    </Modal>
  )
}

export default SendLoadingMemo
