import Link from 'next/link'
import { Tooltip } from 'antd'

const LinkComp = (props) => {
  const { type, data, length, id, blank } = props
  return (
    blank ? (
      <Link href={`/${type}/[id]`} as={`/${type}/${id} `}>
        {data && data.length > length
          ? <a target='_blank' title={data}>{data.slice(0, length) + '...'}</a>
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
