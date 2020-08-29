import { Tooltip } from 'antd'

const Truncate = (props) => {
  const { data, length, link } = props
  return (
    data && data.length > length ? (
      <Tooltip title={data}>
        <span>{data.slice(0, length) + '...'}</span>
      </Tooltip>
    ) : data
  )
}

export default Truncate
