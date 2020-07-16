import { Modal } from 'antd'

const Rebate = (props) => {
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
      <p>Rebate Content will come</p>
    </Modal>
  )
}

export default Rebate
