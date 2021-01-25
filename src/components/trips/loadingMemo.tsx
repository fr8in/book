
import { Modal, Button, Input } from 'antd'
import LinkComp from '../common/link'
import get from 'lodash/get'

const LoadingMemo = (props) => {
  const { visible, onHide ,trip_info} = props
  
  return (
    <Modal
      title={`Loading memo generating using truck document.please upload PAN and {Previous/Current} year TDS in ${get(trip_info, 'truck.truck_no', null)}`}
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
    </Modal>
  )
}

export default LoadingMemo
