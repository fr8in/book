
import { Row, Col, Form } from 'antd'
import FileUpload from '../common/fileUpload'

 
  const truckDocuments = (props) => {

const {truck_id} = props

  return (
    <div>
      <Form layout='vertical'>
        <Row gutter={[10, 10]}>
          <Col span={6}>
            <Row>
              <Form.Item
                label='PAN'
                name='PAN'
                rules={[{ required: true, message: 'PAN is required field!' }]}
              >
                 <FileUpload
                id={truck_id}
                type='truck'
                folder='pan/'
                file_type='pan'
                //file_list={pod_file_list}
              />
              </Form.Item>
            </Row>
          </Col>

          <Col span={6}>
            <Row>
              <Form.Item
                label='Cheque/PassBook'
              >
                 <FileUpload
                id={truck_id}
                type='truck'
                folder='Cheque/PassBook/'
                file_type='Cheque/PassBook'
                //file_list={pod_file_list}
              />
              </Form.Item>
            </Row>
          </Col>

          <Col span={6}>
            <Row>
              <Form.Item
                label='TDS'
              >
               <FileUpload
                id={truck_id}
                type='truck'
                folder='TDS/'
                file_type='TDS'
                //file_list={pod_file_list}
              />
              </Form.Item>
            </Row>
          </Col>

          <Col span={6}>
            <Row>
              <Form.Item label='EMI'>
              <FileUpload
                id={truck_id}
                type='truck'
                folder='EMI/'
                file_type='EMI'
                //file_list={pod_file_list}
              />
              </Form.Item>
            </Row>
          </Col>
        </Row>

        <br />
        <Row gutter={[10, 10]}>
          <Col span={6}>

            <Row>
              <Form.Item
                label='RC'
                name='RC'
                rules={[{ required: true, message: 'RC is required field!' }]}
              >
                <FileUpload
                id={truck_id}
                type='truck'
                folder='RC/'
                file_type='RC'
                //file_list={pod_file_list}
              />
              </Form.Item>
            </Row>
          </Col>

          <Col span={6}>
            <Row>
              <Form.Item
                label='Vaahan'
                name='Vaahan'
                rules={[{ required: true, message: 'Vaahan Screen is required field!' }]}
              >
                 <FileUpload
                id={truck_id}
                type='truck'
                folder='Vaahan/'
                file_type='Vaahan'
                //file_list={pod_file_list}
              />
              </Form.Item>
            </Row>
          </Col>

          <Col span={6}>
            <Row>
              <Form.Item
                label='Insurance'
              >
                <FileUpload
                id={truck_id}
                type='truck'
                folder='Insurance/'
                file_type='Insurance'
                //file_list={pod_file_list}
              />
              </Form.Item>
            </Row>
          </Col>

          <Col span={6}>
            <Row>
              <Form.Item
                label='Permit'
              >
                <FileUpload
                id={truck_id}
                type='truck'
                folder='Permit/'
                file_type='Permit'
                //file_list={pod_file_list}
              />
              </Form.Item>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default truckDocuments