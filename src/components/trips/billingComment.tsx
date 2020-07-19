import { Row, Col, Form, Input, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const BillingComment = () => {
  return (
    <Row>
      <Col xs={24}>
        <Form layout='vertical'>
          <Row gutter={10}>
            <Col xs={12}>
              <Form.Item label='Remarks'>
                <Input
                  id='remarks'
                  placeholder='Remarks'
                  disabled={false}
                />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label='Evidence'>
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
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label='save' className='hideLabel'>
                <Button type='primary'>Save</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  )
}

export default BillingComment
