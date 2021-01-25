
import { Modal, Button, Input } from 'antd'
import LinkComp from '../common/link'
import get from 'lodash/get'
import moment from 'moment'


const LoadingMemo = (props) => {
  const { visible, onHide ,trip_info,tds_current_,tds_previous_} = props
  const tdsYearValidation = moment(trip_info.created_at).isAfter("2020-04-01")
  const tdsYear = tdsYearValidation ? tds_current_ : tds_previous_;
  
  return (
    <Modal
      title={'Loading Memo'}
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
        <p>Truck document required to generate loading memo.
            Please upload in 
                         {<LinkComp
                          type='trucks'
                          data={trip_info.truck.truck_no}
                          id={trip_info.truck.truck_no}
                        />}</p>
    </Modal>
  )
}

export default LoadingMemo
