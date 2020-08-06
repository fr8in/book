import { Row, Col, Button } from 'antd'
import BillingAndInvoiced from '../../components/trips/billingAndInvoiced'
import FileUpload from '../common/fileUpload'
import useShowHide from '../../hooks/useShowHide'

const TripPod = (props) => {
  const { trip_id, trip_info } = props
  const usersInitial = { billing: false }
  const { visible, onShow, onHide } = useShowHide(usersInitial)

  const pod_files = trip_info && trip_info.trip_files && trip_info.trip_files.length > 0 ? trip_info.trip_files.filter(file => file.type === 'POD') : null
  const pod_file_list = pod_files && pod_files.length > 0 && pod_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  return (
    <div>
      <Row>
        <Col xs={24}>
          <Row gutter={10}>
            <Col xs={24} sm={14}>
              <FileUpload
                id={trip_id}
                type='trip'
                folder='pod/'
                file_type='POD'
                file_list={pod_file_list}
              />
            </Col>
            <Col xs={24} sm={10} className='text-right'>
              <Button type='primary' onClick={() => onShow('billing')}>Billing</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      {visible.billing &&
        <BillingAndInvoiced
          visible={visible.billing}
          cardcode={trip_info.customer && trip_info.customer.cardcode}
          trip_id={trip_info.id}
          onHide={onHide}
        />}
    </div>
  )
}

export default TripPod
