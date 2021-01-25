
import { Modal, Button, Input } from 'antd'
import LinkComp from '../common/link'

const LoadingMemo = (props) => {
  const { visible, onHide ,trip_info} = props
  
  return (
    <Modal
      title={`Loading memo generating using truck document.please upload PAN and {Previous/Current} year TDS in 
      ${<LinkComp
        type='trucks'
        data={`${trip_info.truck.truck_no}`}
        id={trip_info.truck.truck_no}
      />}`}
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
    </Modal>
  )
}

export default LoadingMemo
