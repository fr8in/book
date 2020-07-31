
import LabelAndData from '../common/labelAndData'
import Link from 'next/link'
import { Row } from 'antd'
import { PhoneOutlined } from '@ant-design/icons'

const Truck = (props) => {
  const { truckInfo } = props
  console.log('id', props)

  const callNow = data => {
    window.location.href = 'tel:' + data
  }

  const number = truckInfo.partner && truckInfo.partner.partner_users && truckInfo.partner.partner_users.length > 0 &&
          truckInfo.partner.partner_users[0].mobile ? truckInfo.partner.partner_users[0].mobile : '-'

  return (
    <Row>
      <LabelAndData
        label='Partner'
        data={
          <Link href='/partners/[id]' as={`/partners/${truckInfo.partner && truckInfo.partner.cardcode}`}>
            <h4><a>{truckInfo.partner && truckInfo.partner.name}</a></h4>
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
        data={truckInfo.city && truckInfo.city.name}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
    </Row>
  )
}

export default Truck
