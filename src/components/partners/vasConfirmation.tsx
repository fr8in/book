import { Modal, Button } from 'antd'

const VasConfirmation = (props) => {
  const { visible, onHide, data, status } = props

  const updateVasStatus = () => {
    onHide()
  }

  return (
    <Modal
      title={`Vas Request ${status}`}
      visible={visible}
      onCancel={onHide}
      footer={[
        <Button type='default' key='back' onClick={onHide}>Close</Button>,
        <Button type='primary' key='submit' onClick={updateVasStatus}>OK</Button>
      ]}
    >
      <span>Are you sure want to {status}?</span>
    </Modal>
  )
}

export default VasConfirmation
