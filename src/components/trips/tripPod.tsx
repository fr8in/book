import {useState}  from 'react'
import { Row, Col, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import BillingAndInvoiced from '../../components/trips/billingAndInvoiced'
import data from '../../../mock/trip/tripDetail'

const TripPod = () => {
  const usersInitial = { branch:'', visible: false }
  const [branch, setBranch] = useState(usersInitial)
  const closeBilling = () => {
    setBranch(usersInitial)
  }
  const showBilling = (record) => {
    setBranch({...branch, branch: record, visible: true })
  }
  return (
    <div>
    <Row>
      <Col xs={24}>
        <Row gutter={10}>
          <Col flex='auto'>
            <Upload>
              <Button>
                <UploadOutlined /> Select File
              </Button>
            </Upload>
            <Button
              type='primary'
              disabled
              style={{ marginTop: 10 }}
            >
              {'Start Upload'}
            </Button>
          </Col>
          <Col flex='145px'>
            <Button type='primary' onClick={() =>  showBilling(data.customer)}>Billing & Invoice</Button>
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
