
import LabelAndData from '../common/labelAndData'
import Link from 'next/link'
import { Row } from 'antd'
import { PhoneOutlined } from '@ant-design/icons'

const Truck = (props) => {
  const { truck_info } = props

  const callNow = data => {
    window.location.href = 'tel:' + data
  }

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
        data={
          <span className='link' onClick={() => callNow(number)}>
            <PhoneOutlined /> {number}
          </span>
        }
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
