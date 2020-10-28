
import LabelAndData from '../common/labelAndData'
import Link from 'next/link'
import { Row } from 'antd'
import Phone from '../common/phone'

const Truck = (props) => {
  const { truck_info } = props

  const number = truck_info.partner && truck_info.partner.partner_users && truck_info.partner.partner_users.length > 0 &&
          truck_info.partner.partner_users[0].mobile ? truck_info.partner.partner_users[0].mobile : '-'

  return (
    <Row>
      <LabelAndData
        label='Partner'
        data={
          <Link href='/partners/[id]' as={`/partners/${truck_info.partner && truck_info.partner.cardcode}`}>
            <h4><a>{truck_info.partner && truck_info.partner.name}</a></h4>
          </Link>
        }
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='Partner No'
        data={ <Phone number={number} /> }
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='City'
        data={truck_info.city && truck_info.city.name}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
    </Row>
  )
}

export default Truck
