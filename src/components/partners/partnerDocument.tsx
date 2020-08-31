import { Row, Col, Button, Tabs, Space, Input } from 'antd'
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
  return (
    <Tabs onChange={callback} type='card' size='small'>
      <TabPane tab='Main' key='1'>
        <Row gutter={8} className='p10'>
          <Col xs={24} sm={24} md={24}>
            <LabelWithData
              label='PAN'
              data={
                <span>
                  {pan_files ? (
                    <Space>
                      <ViewFile
                        id={partnerInfo.id}
                        type='partner'
                        file_type='PAN'
                        folder='approvals/'
                        file_list={pan_files}
                      />
                      <DeleteFile
                        id={partnerInfo.id}
                        type='partner'
                        file_type='PAN'
                        file_list={pan_files}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
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
              data={<Button shape='circle' icon={<UploadOutlined />} />}
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
            <LabelWithData
              label='TDS'
              data={<Button shape='circle' icon={<UploadOutlined />} />}
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
            <LabelWithData
              label='Agreement'
              data={<Button shape='circle' icon={<UploadOutlined />} />}
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
            <LabelWithData
              label='Cibil Score'
              data={<Button shape='circle' icon={<UploadOutlined />} />}
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
          </Col>
        </Row>
      </TabPane>
      <TabPane tab='Sub Company' key='2'>
        <Row gutter={8} className='p10'>
          <Col xs={24} sm={24} md={24}>
            <Row>
              <Col sm={6}>Name</Col>
              <Col sm={14}><Input placeholder='Company Name' /></Col>
            </Row>
            <Row>
              <Col sm={6}>PAN</Col>
              <Col sm={14}><Input placeholder='PAN Number' /></Col>
              <Col xs={12} sm={4} className='text-right'>
                <Space>
                  <Button
                    type='primary'
                    shape='circle'
                    size='middle'
                    icon={<EyeTwoTone />}
                  />
                  <Button
                    size='middle'
                    shape='circle'
                    icon={<DeleteTwoTone twoToneColor='#eb2f96' />}
                  />
                </Space>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>Cibil Score</Col>
              <Col sm={14}><Input placeholder='Cibil Score' /></Col>
              <Col xs={12} sm={4} className='text-right'>
                <Space>
                  <Button
                    type='primary'
                    shape='circle'
                    size='middle'
                    icon={<EyeTwoTone />}
                  />
                  <Button
                    size='middle'
                    shape='circle'
                    icon={<DeleteTwoTone twoToneColor='#eb2f96' />}
                  />
                </Space>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>TDS</Col>
              <Col sm={14}> </Col>
              <Col xs={12} sm={4} className='text-right'>
                <Space>
                  <Button
                    type='primary'
                    shape='circle'
                    size='middle'
                    icon={<EyeTwoTone />}
                  />
                  <Button
                    size='middle'
                    shape='circle'
                    icon={<DeleteTwoTone twoToneColor='#eb2f96' />}
                  />
                </Space>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>Trucks</Col>
              <Col sm={18}><Input placeholder='Add Trucks' /></Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} className='text-right'><Button>Save</Button></Col>
            </Row>

          </Col>
        </Row>
      </TabPane>
    </Tabs>
  )
}

export default PartnerDocument
