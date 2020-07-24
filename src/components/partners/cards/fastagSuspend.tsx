import { Modal } from 'antd'
import { QuestionCircleTwoTone } from '@ant-design/icons'

const FastagSuspend = (props) => {
  const { visible, onHide, data } = props

  const onSubmit = () => {
    console.log('Suspended!', data)
    onHide()
  }

  return (
    <Modal visible={visible} onOk={onSubmit} onCancel={onHide}>
      <h3>
        <QuestionCircleTwoTone twoToneColor='#ffc107' /> Suspended Tags will get
        permanently deactivated. This action cannot be undone
      </h3>
      <br />
      <p>Do you want to proceed?</p>
    </Modal>
  )
}

export default FastagSuspend
