import { Tag, Row } from 'antd'

const Title = (props) => {
  const { name, data, alignRight } = props
  return (
      <Row justify={alignRight ? 'end' : 'start'}>
        {name}{data && <Tag color='#108ee9'>{data}</Tag>} 
      </Row>
  )
}

export default Title
