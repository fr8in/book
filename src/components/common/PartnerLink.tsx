import { Tooltip } from 'antd'
import Link from 'next/link'
import LinkComp from './link'
import get from 'lodash/get'
import { gql, useQuery } from '@apollo/client'
import { isArray } from 'lodash'
import { useState } from 'react'

const PARTNER_MEMBERSHIP_QUERY = gql`
query partner_membership($id:Int,$year:Int,$month:Int){
    partner(where: {id: {_eq: $id}}) {
      partner_membership_targets(where: {year: {_eq: $year}, month: {_eq: $month}}) {
        gold
        platinum
        month
        actual {
          gmv
        }
      }
    }
  }
`
const PartnerLink = (props) => {

    const { type, data, length, cardcode, blank, id } = props

    const [partnerMembership, setPartnerMembership] = useState(false)
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    console.log('partnerMembership',partnerMembership)
    const onChange = (visibile) =>{
        setPartnerMembership(visibile)
       
    }
    const { loading, data: _data, error } = useQuery(
        PARTNER_MEMBERSHIP_QUERY,
        {
            variables: {
                id: id,
                year: year,
                month: month
            },
            skip: !partnerMembership,
        })


    let _sdata = {}
    if (!loading) {
        _sdata = _data
    }
    
        else return null
    
    const partner = get(_sdata, 'partner.partner_membership_targets', null)
    console.log('partner', partner)
    return (
        blank ? (
            <>
                <Link href={`/${type}/[cardcode]`} as={`/${type}/${cardcode} `}>
                    <Tooltip
                    onVisibleChange={onChange}
                        title={
                            `id:${id}
                             G:${year}
                             P:${month}
                             `}>
                        {data && data.length > length
                            ? <a target='_blank' title={data}>{data.slice(0, length) + '...'}</a>
                            : <a target='_blank'>{data}</a>}
                    </Tooltip>
                </Link>
            </>
        )
            : (
                <Link href={`/${type}/[cardcode]`} as={`/${type}/${cardcode} `}>
                    {data && data.length > length
                        ? <Tooltip title={data}><a>{data.slice(0, length) + '...'}</a></Tooltip>
                        : <a>{data}</a>}
                </Link>)
    )
}
export default PartnerLink