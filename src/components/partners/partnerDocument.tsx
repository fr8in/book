import { Row, Col, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import LabelWithData from '../common/labelWithData'

const PartnerDocument = () => {
  return (
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
  )
}

export default PartnerDocument
