import { useState } from 'react'
import { Row, Col, Button } from 'antd'
import BillingAndInvoiced from '../../components/trips/billingAndInvoiced'
import data from '../../../mock/trip/tripDetail'
import FileUpload from '../common/fileUpload'

const TripPod = (props) => {
  const { trip_id, trip_info } = props
  const usersInitial = { branch: '', visible: false }
  const [branch, setBranch] = useState(usersInitial)
  const pod_files = trip_info.trip_files.filter(file => file.type === 'pod')

  const pod_file_list = pod_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })
  console.log('pod_files', pod_file_list)

  const closeBilling = () => {
    setBranch(usersInitial)
  }
  const showBilling = (record) => {
    setBranch({ ...branch, branch: record, visible: true })
  }
  return (
    <div>
      <Row>
        <Col xs={24}>
          <Row gutter={10}>
            <Col xs={24} sm={14}>
              <FileUpload
                trip_id={trip_id}
                type='trip'
                folder='pod/'
                file_type='pod'
                file_list={pod_file_list}
              />
            </Col>
            <Col xs={24} sm={10} className='text-right'>
              <Button type='primary' onClick={() => showBilling(data.customer)}>Billing</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      {branch.visible &&
        <BillingAndInvoiced
          visible={branch.visible}
          data={branch.branch}
          onHide={closeBilling}
        />}
    </div>
  )
}

export default TripPod
