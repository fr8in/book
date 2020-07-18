import { Row, Col, Select, Button, Checkbox, Space } from 'antd'
import { EyeOutlined, SaveOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'

const TripLr = () => {
  return (
    <Row gutter={8}>
      <Col xs={24} sm={12}>
        <Select
          id='lr'
          mode='tags'
          maxTagCount={7}
          style={{ width: '100%' }}
          placeholder='Enter valid LR numbers'
          disabled={false}
        />
      </Col>
      <Col xs={24} sm={12}>
        <Space>
          <Button type='primary' icon={<SaveOutlined />} />
          <Button size='small' shape='circle' icon={<EyeOutlined />} />
          <Button size='small' shape='circle' icon={<DeleteOutlined />} />
          <Button size='small' shape='circle' icon={<UploadOutlined />} />
          <Checkbox checked disabled={false}>Customer Confirmation</Checkbox>
        </Space>
      </Col>
    </Row>
  )
}

export default TripLr
