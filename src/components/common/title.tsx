import { Tag, Row } from 'antd'

const Title = (props) => {
  const { name, data } = props
  return (
    <div>
      <Row>
      {data && <Tag color='#108ee9'>{data}</Tag>}{name}
      </Row>
    </div>
  )
}

export default Title
