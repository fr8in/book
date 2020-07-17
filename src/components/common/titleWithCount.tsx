import { Tag } from 'antd'

const TitleWithCount = (props) => {
  const { name, value } = props
  return (
    <span className='titleCount'>
      {name}
      {value && <Tag>{value}</Tag>}
    </span>
  )
}

export default TitleWithCount
