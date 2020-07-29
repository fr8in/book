import { Row, Col, Divider } from 'antd'
import LabelAndData from '../common/labelAndData'
import LabelWithData from '../common/labelWithData'
import Link from 'next/link'
import { EditTwoTone } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import CustomerPrice from '../trips/customerPrice'
import data from '../../../mock/trip/tripDetail'

const TripInfo = (props) => {
  const { tripInfo } = props
  const initial = { price: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  // const { data } = props
  return (
    <Row>
      <Col xs={24}>
        <Row>
          <Col flex='auto'>
            <Row>
              <LabelAndData
                smSpan={12}
                label={<p className='mb0 b'>Customer</p>}
                data={
                  <Link href='/customers/[id]' as={`/customers/${tripInfo.customer.cardcode}`}>
                    <a>{tripInfo.customer.name}</a>
                  </Link>
                }
              />
              <LabelAndData
                smSpan={12}
                label={<p className='mb0 b'>Partner</p>}
                data={
                  <Link href='/partners/[id]' as={`/partners/${tripInfo.partner.cardcode}`}>
                    <a>{tripInfo.partner.name}</a>
                  </Link>
                }
              />
            </Row>
          </Col>
          <Col flex='120px'>
            <Row>
              <LabelAndData
                smSpan={24}
                label={<p className='mb0 b'>Truck No</p>}
                data={
                  <Link href='/trucks/[id]' as={`/truck/${tripInfo.truck.truck_no}`}>
                    <a>{tripInfo.truck.truck_no}</a>
                  </Link>
                }
              />
            </Row>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col sm={24} md={12}>
            <LabelWithData label='Order Date' data={tripInfo.order_date} labelSpan={10} />
            <LabelWithData label='ETA' data={tripInfo.eta} labelSpan={10} />
            <LabelWithData
              label='Customer Price'
              data={<p>{tripInfo.trip_prices && tripInfo.trip_prices[0].customer_price} <EditTwoTone onClick={() => onShow('price')} /></p>}
              labelSpan={10}
            />
            <LabelWithData label='Cash' data={tripInfo.trip_prices[0].cash} labelSpan={10} />
            <LabelWithData label='To Pay' data={tripInfo.trip_prices[0].to_pay} labelSpan={10} />
            <LabelWithData label='Mamul' data={tripInfo.trip_prices[0].mamul} labelSpan={10} />
          </Col>
          <Col sm={24} md={12}>
            <LabelWithData label='PO Date' data={tripInfo.po_date} labelSpan={10} />
            <LabelWithData label='Delay' data={tripInfo.delay} labelSpan={10} />
            <LabelWithData label='Partner Price' data={tripInfo.trip_prices[0].partner_price} labelSpan={10} />
            <LabelWithData label='Including loading' data={tripInfo.trip_prices.including_loading =true? 'Yes' : 'No'} labelSpan={10} />
            <LabelWithData label='Including Unloading' data={tripInfo.trip_prices.including_unloading =true? 'yes' : 'No'} labelSpan={10} />
          </Col>
        </Row>
      </Col>
      {visible.price && <CustomerPrice visible={visible.price} onHide={onHide} />}
    </Row>
  )
}

export default TripInfo
