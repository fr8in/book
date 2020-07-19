import { Row, Col, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const TripPod = () => {
  return (
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
            <Button type='primary'>Billing & Invoice</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default TripPod
