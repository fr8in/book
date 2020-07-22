import { Row, Col, Tooltip, Space } from 'antd'
import { InfoCircleTwoTone } from '@ant-design/icons'

const LabelData = (props) => {
  const { info, label, count, value } = props
  return (
    <Row>
      <Col flex='auto'>
        <Space>
          {info &&
            <Tooltip title={info}><InfoCircleTwoTone /></Tooltip>}
          <span>{label}</span>
          {count && <span>({count})</span>}
        </Space>
      </Col>
      <Col flex='80px' className='text-right'>
        <span>{value || 0}</span>
      </Col>
    </Row>
  )
}
export default LabelData
