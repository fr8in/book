import { Tooltip } from 'antd'
import u from '../../lib/util'
import get from 'lodash/get'
import { gql, useLazyQuery } from '@apollo/client'
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

    const { type, data, length, cardcode, id } = props

    const [partnerMembership, setPartnerMembership] = useState(false)
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1

    const [getLink, { loading, data: _data }] = useLazyQuery(PARTNER_MEMBERSHIP_QUERY)

    let target_data = {}
    if (!loading) {
        target_data = _data
    }
    else return null

    const partner = get(target_data, 'partner[0].partner_membership_targets[0]', null)

    const onChange = (visible) => {
        setPartnerMembership(visible)
        getLink({
            variables: {
                id: id,
                year: year,
                month: month
            }
        })
    }
    
    return (
        <div >
             <Tooltip
             onVisibleChange={onChange}
             title={
                 `A:${u.convertToLakhs(get(partner, 'actual.gmv'))}
                  G:${u.convertToLakhs(get(partner, 'gold', 0))}
                  P:${u.convertToLakhs(get(partner, 'platinum', 0))}
                  `}
                  >
          <a target='_blank' href={`/${type}/${cardcode}`}>{u.shrinkText(data,length)}</a>
         </Tooltip>
                   
        </div>
    )
}
export default PartnerLink