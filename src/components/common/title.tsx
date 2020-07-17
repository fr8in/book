import { Tag } from 'antd'

const Title = (props) => {
  const { name, data } = props
  return (
    <div>{name}
      {data && <Tag color='#108ee9'>{data}</Tag>}
    </div>
  )
}

export default Title
