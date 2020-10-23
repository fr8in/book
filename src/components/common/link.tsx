import Link from 'next/link'
import { Tooltip } from 'antd'

const LinkComp = (props) => {
  const { type, data, length, id, blank } = props
  return (
    blank ? (
      <Link href={`/${type}/[id]`} as={`/${type}/${id} `}>
        {data && data.length > length
          ? <Tooltip title={data}><a target='_blank'>{data.slice(0, length) + '...'}</a></Tooltip>
          : <a target='_blank'>{data}</a>}
      </Link>)
      : (
        <Link href={`/${type}/[id]`} as={`/${type}/${id} `}>
          {data && data.length > length
            ? <Tooltip title={data}><a>{data.slice(0, length) + '...'}</a></Tooltip>
            : <a>{data}</a>}
        </Link>)
  )
}

export default LinkComp
