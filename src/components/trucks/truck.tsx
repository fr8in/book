
import LabelAndData from '../common/labelAndData'
import Link from 'next/link'
import data from '../../../mock/trucks/truckDetail'
import { Row } from 'antd'
import { PhoneOutlined } from '@ant-design/icons'

const Truck = (props) => {
  const { truckInfo } = props
  console.log('id', props)

  const callNow = data => {
    window.location.href = 'tel:' + data
  }

  return (
    <Row>
      <LabelAndData
        label='Partner'
        data={
          <Link href='/partners/[id]' as={`/partners/${truckInfo.partner.cardcode}`}>
            <h4><a>{truckInfo.partner.name}</a></h4>
          </Link>
        }
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='Partner No'
        data={
          <span className='link' onClick={() => callNow(truckInfo.driver.mobile_no)}>
            <PhoneOutlined /> {truckInfo.driver.mobile_no}
          </span>
        }
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='City'
        data={truckInfo.city.name}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
      <LabelAndData
        label='TAT'
        data={data.truck.tat}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
    </Row>
  )
}

export default Truck
