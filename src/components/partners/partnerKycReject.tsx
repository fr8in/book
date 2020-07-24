import { Modal, Button,Input } from 'antd'

const KycReject = (props) => {
  const { visible, onHide } = props
 
  return (
    <>
      <Modal
        title='Reject Partner'
        visible={visible}
        onCancel={onHide}
        footer={[
          <Button key='back' onClick={onHide}>Cancel</Button>,
          <Button key='submit' type='primary'>Ok</Button>
        ]}
      >
        <Input placeholder='Enter Reject Reason'/>
      </Modal>
    </>
  )
}

export default KycReject;
