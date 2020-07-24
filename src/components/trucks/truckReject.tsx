import { Modal, Button,Input } from 'antd'

const TruckReject = (props) => {
  const { visible, onHide } = props
 
  return (
    <>
      <Modal
        title='Reject Truck'
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

export default TruckReject
