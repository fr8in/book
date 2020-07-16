import { Modal } from 'antd'

const Transfer = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }
  return (
    <Modal
      title='Wallet Balance : 1250'
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
    >
      <p>Transfer Content will come</p>
    </Modal>
  )
}

export default Transfer
