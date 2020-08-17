
import { Row, Col, Form } from 'antd'
import FileUpload from '../common/fileUpload'

 
  const truckDocuments = (props) => {

const {truck_id,truck_info,partner_id} = props

const rc_files = truck_info && truck_info.truck_files && truck_info.truck_files.length > 0 ? truck_info.truck_files.filter(file => file.type === 'RC') : null
const rc_file_list = rc_files && rc_files.length > 0 && rc_files.map((file, i) => {
  return ({
    uid: `${file.type}-${i}`,
    name: file.file_path,
    status: 'done'
  })
})

const insurance_files = truck_info && truck_info.truck_files && truck_info.truck_files.length > 0 ? truck_info.truck_files.filter(file => file.type === 'insurance') : null
const insurance_file_list = insurance_files && insurance_files.length > 0 && insurance_files.map((file, i) => {
  return ({
    uid: `${file.type}-${i}`,
    name: file.file_path,
    status: 'done'
  })
})

const permit_files = truck_info && truck_info.truck_files && truck_info.truck_files.length > 0 ? truck_info.truck_files.filter(file => file.type === 'permit') : null
const permit_file_list = permit_files && permit_files.length > 0 && permit_files.map((file, i) => {
  return ({
    uid: `${file.type}-${i}`,
    name: file.file_path,
    status: 'done'
  })
})

const emi_files = truck_info && truck_info.truck_files && truck_info.truck_files.length > 0 ? truck_info.truck_files.filter(file => file.type === 'EMI') : null
const emi_file_list = emi_files && emi_files.length > 0 && emi_files.map((file, i) => {
  return ({
    uid: `${file.type}-${i}`,
    name: file.file_path,
    status: 'done'
  })
})

const pan_files = truck_info && truck_info.partner && truck_info.partner.partner_files && truck_info.partner.partner_files.length > 0 ? truck_info.partner.partner_files.filter(file => file.type === 'PAN') : null
const pan_file_list = pan_files && pan_files.length > 0 && pan_files.map((file, i) => {
  return ({
    uid: `${file.type}-${i}`,
    name: file.file_path,
    status: 'done'
  })
})

const tds_files = truck_info && truck_info.partner && truck_info.partner.partner_files && truck_info.partner.partner_files.length > 0 ? truck_info.partner.partner_files.filter(file => file.type === 'TDS') : null
const tds_file_list = tds_files && tds_files.length > 0 && tds_files.map((file, i) => {
  return ({
    uid: `${file.type}-${i}`,
    name: file.file_path,
    status: 'done'
  })
})

const cl_files = truck_info && truck_info.partner && truck_info.partner.partner_files && truck_info.partner.partner_files.length > 0 ? truck_info.partner.partner_files.filter(file => file.type === 'CL') : null
const cl_file_list = cl_files && cl_files.length > 0 && cl_files.map((file, i) => {
  return ({
    uid: `${file.type}-${i}`,
    name: file.file_path,
    status: 'done'
  })
})

const vaahan_files = truck_info && truck_info.truck_files && truck_info.truck_files.length > 0 ? truck_info.truck_files.filter(file => file.type === 'vaahan') : null
const vaahan_file_list = vaahan_files && vaahan_files.length > 0 && vaahan_files.map((file, i) => {
  return ({
    uid: `${file.type}-${i}`,
    name: file.file_path,
    status: 'done'
  })
})



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
                id={partner_id}
                type='partner'
                folder='approvals/'
                file_type='PAN'
               file_list={pan_file_list}
              />
              </Form.Item>
            </Row>
          </Col>

          <Col span={6}>
            <Row>
              <Form.Item
                label='Cheque/PassBook'
                name='CL'
              >
                 <FileUpload
                id={partner_id}
                type='partner'
                folder='approvals/'
                file_type='CL'
                file_list={cl_file_list}
              />
              </Form.Item>
            </Row>
          </Col>

          <Col span={6}>
            <Row>
              <Form.Item
                label='TDS'
                name='TDS'
              >
               <FileUpload
                id={partner_id}
                type='partner'
                folder='approvals/'
                file_type='TDS'
                file_list={tds_file_list}
              />
              </Form.Item>
            </Row>
          </Col>

          <Col span={6}>
            <Row>
              <Form.Item label='EMI' name='EMI'>
              <FileUpload
                id={truck_id}
                type='truck'
                folder='approvals/'
                file_type='EMI'
                file_list={emi_file_list}
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
                folder='approvals/'
                file_type='RC'
                file_list={rc_file_list}
              />
              </Form.Item>
            </Row>
          </Col>

          <Col span={6}>
            <Row>
              <Form.Item
                label='Vaahan'
                name='vaahan'
                rules={[{ required: true, message: 'Vaahan Screen is required field!' }]}
              >
                 <FileUpload
                id={truck_id}
                type='truck'
                folder='approvals/'
                file_type='vaahan'
                file_list={vaahan_file_list}
              />
              </Form.Item>
            </Row>
          </Col>

          <Col span={6}>
            <Row>
              <Form.Item
                label='Insurance'
                name='insurance'
              >
                <FileUpload
                id={truck_id}
                type='truck'
                folder='approvals/'
                file_type='insurance'
                file_list={insurance_file_list}
              />
              </Form.Item>
            </Row>
          </Col>

          <Col span={6}>
            <Row>
              <Form.Item
                label='Permit'
                name='permit'
              >
                <FileUpload
                id={truck_id}
                type='truck'
                folder='approvals/'
                file_type='permit'
                file_list={permit_file_list}
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