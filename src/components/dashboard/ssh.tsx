import { Modal, Input } from 'antd'
import { UnlockOutlined } from '@ant-design/icons'

const Ssh = (props) => {
  const { visible, onHide } = props

  return (
    <Modal
      title='SSH Access'
      visible={visible}
    
      onCancel={onHide}
    >
      <Input placeholder='Enter your IPV4' prefix={<UnlockOutlined />} />
    </Modal>
  )
}

export default Ssh
