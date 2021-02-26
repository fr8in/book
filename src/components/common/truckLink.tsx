import Link from 'next/link'
import { Tooltip,Badge } from 'antd'
import React from 'react'
import { BulbTwoTone } from '@ant-design/icons'


const LinkComp = (props) => {
  const { type, data, length, id, blank,avg_km,count,avg_km_speed_category_id } = props

 return (
     <>
      <Badge count={count}  className='truckBadgeCount' style={{ backgroundColor: (avg_km_speed_category_id ===3) ? '#eca92b' :  (avg_km_speed_category_id ===4) ? '#28a745' : (avg_km_speed_category_id ===5) ? '#3b7ddd' : null }}></Badge>
    {blank ? (
      <Link href={`/${type}/[id]`} as={`/${type}/${id} `}>
        {data && data.length > length
          ? <a target='_blank' title={data}>{data.slice(0, length) + '...'}</a>
          : <a target='_blank'>{data}</a>}
      </Link> )
      : (
        <Link href={`/${type}/[id]`} as={`/${type}/${id} `}>
          {data && data.length > length
            ? <Tooltip title={[data,' ',`Speed:${avg_km}`]}><a>{data.slice(0, length) + '...'}</a></Tooltip>
            : <Tooltip title={`Speed:${avg_km}`}><a>{data}</a></Tooltip>}
        </Link> )  }
        </>
  )
}

export default LinkComp
