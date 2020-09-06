import { Row, Col, Button, Tabs, Space, Input, Form } from 'antd'
import { UploadOutlined, EyeTwoTone, DeleteTwoTone } from '@ant-design/icons'
import LabelWithData from '../common/labelWithData'
import FileUploadOnly from '../common/fileUploadOnly'
import ViewFile from '../common/viewFile'
import DeleteFile from '../common/deleteFile'

const { TabPane } = Tabs
const PartnerDocument = (props) => {
  const { partnerInfo } = props
  const callback = (key) => {
    console.log(key)
  }
  const files = partnerInfo.partner_files
  const pan_doc = files.filter(file => file.type === 'PAN')
  const pan_files = pan_doc && pan_doc.length > 0 ? pan_doc.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  }) : []
  console.log('file', pan_doc)

  const cheaque_doc = files.filter(file => file.type === 'CL')
  const cheaque_files = cheaque_doc && cheaque_doc.length > 0 ? cheaque_doc.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  }) : []
  console.log('file', cheaque_doc)

  const tds_doc = files.filter(file => file.type === 'TDS')
  const tds_files = tds_doc && tds_doc.length > 0 ? tds_doc.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  }) : []
  console.log('file', tds_doc)

  const agreement_doc = files.filter(file => file.type === 'Agreement')
  const agreement_files = agreement_doc && agreement_doc.length > 0 ? agreement_doc.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  }) : []
  console.log('file', agreement_doc)

  const cs_doc = files.filter(file => file.type === 'CS')
  const cs_files = cs_doc && cs_doc.length > 0 ? cs_doc.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  }) : []
  console.log('file', cs_doc)

  return (
    <Tabs onChange={callback} type='card' size='small'>
      <TabPane tab='Main' key='1'>
        <Row gutter={8} className='p10'>
          <Col xs={24} sm={24} md={24}>
            <LabelWithData
              label='PAN'
              data={
                <span>
                  {pan_files && pan_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='PAN'
                        folder='approvals/'
                        file_list={pan_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='PAN'
                        file_list={pan_files}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={partnerInfo.id}
                      type='partner'
                      folder='approvals/'
                      file_type='PAN'
                      file_list={pan_files}
                    />
                  )}
                </span>
              }
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
            <LabelWithData
              label='Cheque'
              data={
                <span>
                  {cheaque_files && cheaque_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='CL'
                        folder='approvals/'
                        file_list={cheaque_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='CL'
                        file_list={cheaque_files}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={partnerInfo.id}
                      type='partner'
                      folder='approvals/'
                      file_type='CL'
                      file_list={cheaque_files}
                    />
                  )}
                </span>
              }
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
            <LabelWithData
              label='TDS'
              data={
                <span>
                  {tds_files && tds_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='TDS'
                        folder='approvals/'
                        file_list={tds_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='TDS'
                        file_list={tds_files}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={partnerInfo.id}
                      type='partner'
                      folder='approvals/'
                      file_type='TDS'
                      file_list={tds_files}
                    />
                  )}
                </span>
              }
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
            <LabelWithData
              label='Agreement'
              data={
                <span>
                  {agreement_files && agreement_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='Agreement'
                        folder='approvals/'
                        file_list={agreement_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='Agreement'
                        file_list={agreement_files}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={partnerInfo.id}
                      type='partner'
                      folder='approvals/'
                      file_type='Agreement'
                      file_list={agreement_files}
                    />
                  )}
                </span>
              }
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
            <LabelWithData
              label='Cibil Score'
              data={
                <span>
                  {cs_files && cs_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='CS'
                        folder='approvals/'
                        file_list={cs_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='CS'
                        file_list={cs_files}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={partnerInfo.id}
                      type='partner'
                      folder='approvals/'
                      file_type='CS'
                      file_list={cs_files}
                    />
                  )}
                </span>
              }
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
          </Col>
        </Row>
      </TabPane>
      <TabPane tab='Sub Company' key='2'>
        <Form layout='horizontal'>
          <Row gutter={8} className='p10'>
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label='Name'
              >
                <Col offset={1} sm={17}>
                  <Input placeholder='Name' />
                </Col>
              </Form.Item>
              <Form.Item
                label='PAN'
              >
                <Row justify='end'>
                  <Col offset={1} sm={16}>
                    <Input placeholder='PAN Number' />
                  </Col>
                  <Col offset={3} sm={3}>
                    <Space>
                      <Button
                        type='primary'
                        shape='circle'
                        icon={<EyeTwoTone />}
                      />
                      <Button
                        shape='circle'
                        icon={<DeleteTwoTone twoToneColor='#eb2f96' />}
                      />
                    </Space>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                label='Cibil Score'
              >
                <Row justify='end'>
                  <Col sm={18}>
                    <Input placeholder='Cibil Score' />
                  </Col>
                  <Col offset={3} sm={3}>
                    <Space>
                      <Button
                        type='primary'
                        shape='circle'
                        icon={<EyeTwoTone />}
                      />
                      <Button
                        shape='circle'
                        icon={<DeleteTwoTone twoToneColor='#eb2f96' />}
                      />
                    </Space>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                label='TDS'
              >
                <Row justify='end'>
                  <Col offset={3} sm={3}>
                    <Space>
                      <Button
                        type='primary'
                        shape='circle'
                        icon={<EyeTwoTone />}
                      />
                      <Button
                        shape='circle'
                        icon={<DeleteTwoTone twoToneColor='#eb2f96' />}
                      />
                    </Space>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                label='Trucks'
              >
                <Input placeholder='Add Trucks' />
              </Form.Item>
              <Row justify='end'>
                <Button type='primary'>Save</Button>
              </Row>
            </Col>
          </Row>
        </Form>
      </TabPane>
    </Tabs>
  )
}

export default PartnerDocument
