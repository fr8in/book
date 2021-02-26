import { Badge } from 'antd'

const PartnerBadge = (props) => {

    const {count} = props

  return (
     <Badge  count={count} ></Badge>
  )
}

export default PartnerBadge
