import Link from 'next/link'
import { Tooltip } from 'antd'

const LinkComp = (props) => {
  const { type, data, length, id } = props
  return (
    <Link href={`/${type}/[id]`} as={`/${type}/${id} `}>
      {data && data.length > length
        ? <Tooltip title={data}><a>{data.slice(0, length) + '...'}</a></Tooltip>
        : <a>{data}</a>}
    </Link>
  )
}

export default LinkComp
