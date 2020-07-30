import { Modal, Select } from 'antd'
import EmailList from '../../../mock/sourcing/employeeList'

const EmployeeList = (props) => {
  const { visible, onHide } = props

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }
  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }
  return (
    <Modal
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
    >
      <Select defaultValue='Owner' style={{ width: 300 }} onChange={handleChange} options={EmailList} />
    </Modal>
  )
}

export default EmployeeList
