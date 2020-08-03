import { Row, Col, Button, Tabs, Space,Input  } from 'antd'
import { UploadOutlined,EyeTwoTone,DeleteTwoTone } from '@ant-design/icons'
import LabelWithData from '../common/labelWithData'

const { TabPane } = Tabs;
const PartnerDocument = () => {
  function callback(key) {
    console.log(key);
  }
  return (
    <Tabs onChange={callback} type="card" size='small'>
      <TabPane tab="Main" key="1">
        <Row gutter={8} className='p10'>
          <Col xs={24} sm={24} md={24}>
            <LabelWithData
              label='PAN'
              data={<Button icon={<UploadOutlined />} />}
              labelSpan={10}
              dataSpan={14}
            />
            <LabelWithData
              label='Card Number'
              data={<Button icon={<UploadOutlined />} />}
              labelSpan={10}
              dataSpan={14}
            />
            <LabelWithData
              label='Balance'
              data={<Button icon={<UploadOutlined />} />}
              labelSpan={10}
              dataSpan={14}
            />
            <LabelWithData
              label=' Linked Mobile '
              data={<Button icon={<UploadOutlined />} />}
              labelSpan={10}
              dataSpan={14}
            />

            <LabelWithData
              label='Status'
              data={<Button icon={<UploadOutlined />} />}
              labelSpan={10}
              dataSpan={14}
            />
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Sub Company" key="2">
        <Row gutter={8} className='p10'>
          <Col xs={24} sm={24} md={24}>
            <Row>
              <Col sm={6}>Name</Col>
              <Col sm={14}><Input  placeholder='Company Name' /></Col>
            </Row>
            <br />
            <Row>
              <Col sm={6}>PAN</Col>
              <Col sm={14}><Input  placeholder='PAN Number' /></Col>
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
            <br />
            <Row>
              <Col sm={6}>Cibil Score</Col>
              <Col sm={14}><Input  placeholder='Cibil Score' /></Col>
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
            <br />
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
            <br />
            <Row>
              <Col sm={6}>Trucks</Col>
              <Col sm={18}><Input  placeholder='Add Trucks' /></Col>
            </Row>
            <br />
            <Row>
              <Col xs={24} sm={24} className='text-right' ><Button>Save</Button></Col>
            </Row>

          </Col>
        </Row>
      </TabPane>
    </Tabs>
  )
}

export default PartnerDocument
