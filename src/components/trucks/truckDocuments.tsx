
import { Row, Col, Form } from 'antd'
import FileUpload from '../common/fileUpload'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import u from '../../lib/util'

const truckDocuments = (props) => {
  const { truck_id, truck_info, partner_id } = props

  const files = get(truck_info, 'partner.partner_files', [])
  const truck_files = get(truck_info, 'truck_files', [])
  const rc_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.rc) : null
  const rc_file_list = !isEmpty(rc_files) && rc_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  const insurance_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.insurance) : null
  const insurance_file_list = !isEmpty(insurance_files) && insurance_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  const permit_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.permit) : null
  const permit_file_list = !isEmpty(permit_files) && permit_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  const emi_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.emi) : null
  const emi_file_list = !isEmpty(emi_files) && emi_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  const pan_files = !isEmpty(files) ? files.filter(file => file.type === u.fileType.partner_pan) : null
  const pan_file_list = !isEmpty(pan_files) && pan_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  const tds_files = !isEmpty(files) ? files.filter(file => file.type === u.fileType.tds) : null
  const tds_file_list = !isEmpty(tds_files) && tds_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  const cl_files = !isEmpty(files) ? files.filter(file => file.type === u.fileType.check_leaf) : null
  const cl_file_list = !isEmpty(cl_files) && cl_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  const vaahan_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.vaahan) : null
  const vaahan_file_list = !isEmpty(vaahan_files) && vaahan_files.map((file, i) => {
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
            <Form.Item
              label='PAN'
              name='PAN'
              rules={[{ required: true, message: 'PAN is required field!' }]}
            >
              <FileUpload
                id={partner_id}
                type='partner'
                folder={u.folder.approvals}
                file_type={u.fileType.partner_pan}
                file_list={pan_file_list}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label='Cheque/PassBook'
              name='CL'
            >
              <FileUpload
                id={partner_id}
                type='partner'
                folder={u.folder.approvals}
                file_type={u.fileType.check_leaf}
                file_list={cl_file_list}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label='TDS'
              name='TDS'
            >
              <FileUpload
                id={partner_id}
                type='partner'
                folder={u.folder.approvals}
                file_type={u.fileType.tds}
                file_list={tds_file_list}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label='EMI' name='EMI'>
              <FileUpload
                id={truck_id}
                type='truck'
                folder={u.folder.approvals}
                file_type={u.fileType.emi}
                file_list={emi_file_list}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col span={6}>
            <Form.Item
              label='RC'
              name='RC'
              rules={[{ required: true, message: 'RC is required field!' }]}
            >
              <FileUpload
                id={truck_id}
                type='truck'
                folder={u.folder.approvals}
                file_type={u.fileType.rc}
                file_list={rc_file_list}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label='Vaahan'
              name='vaahan'
              rules={[{ required: true, message: 'Vaahan Screen is required field!' }]}
            >
              <FileUpload
                id={truck_id}
                type='truck'
                folder={u.folder.approvals}
                file_type={u.fileType.vaahan}
                file_list={vaahan_file_list}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label='Insurance'
              name='insurance'
            >
              <FileUpload
                id={truck_id}
                type='truck'
                folder={u.folder.approvals}
                file_type={u.fileType.insurance}
                file_list={insurance_file_list}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label='Permit'
              name='permit'
            >
              <FileUpload
                id={truck_id}
                type='truck'
                folder={u.folder.approvals}
                file_type={u.fileType.permit}
                file_list={permit_file_list}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default truckDocuments
