import { Row, Col, Divider } from 'antd'
import LabelAndData from '../common/labelAndData'
import LabelWithData from '../common/labelWithData'
import Link from 'next/link'
import { EditTwoTone } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import CustomerPrice from '../trips/customerPrice'
import moment from 'moment'
// import data from '../../../mock/trip/tripDetail'

const TripInfo = (props) => {
  const { trip_info } = props
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
                  <Link href='/customers/[id]' as={`/customers/${trip_info.customer && trip_info.customer.cardcode}`}>
                    <a>{trip_info.customer && trip_info.customer.name}</a>
                  </Link>
                }
              />
              <LabelAndData
                smSpan={12}
                label={<p className='mb0 b'>Partner</p>}
                data={
                  <Link href='/partners/[id]' as={`/partners/${trip_info.partner && trip_info.partner.cardcode}`}>
                    <a>{trip_info.partner && trip_info.partner.name}</a>
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
                  <Link href='/trucks/[id]' as={`/truck/${trip_info.truck && trip_info.truck.truck_no}`}>
                    <a>{trip_info.truck && trip_info.truck.truck_no}</a>
                  </Link>
                }
              />
            </Row>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col sm={24} md={12}>
            <LabelWithData
              label='Order Date' data={trip_info.order_date ? (
                moment(trip_info.order_date).format('DD-MMM-YYYY hh:mm')
              ) : ''} labelSpan={10}
            />
            <LabelWithData
              label='ETA' data={trip_info.eta ? (
                moment(trip_info.eta).format('DD-MMM-YYYY hh:mm')
              ) : ''} labelSpan={10}
            />
            <LabelWithData
              label='Customer Price'
              data={<p>{trip_info.trip_prices && trip_info.trip_prices[0].customer_price} <EditTwoTone onClick={() => onShow('price')} /></p>}
              labelSpan={10}
            />
            <LabelWithData label='Cash' data={trip_info.trip_prices && trip_info.trip_prices[0].cash} labelSpan={10} />
            <LabelWithData label='To Pay' data={trip_info.trip_prices && trip_info.trip_prices[0].to_pay} labelSpan={10} />
            <LabelWithData label='Mamul' data={trip_info.trip_prices && trip_info.trip_prices[0].mamul} labelSpan={10} />
          </Col>
          <Col sm={24} md={12}>
            <LabelWithData
              label='PO Date' data={trip_info.po_date ? (
                moment(trip_info.po_date).format('DD-MMM-YYYY hh:mm')
              ) : ''} labelSpan={10}
            />
            <LabelWithData label='Delay' data={trip_info.delay} labelSpan={10} />
            <LabelWithData label='Partner Price' data={trip_info.trip_prices && trip_info.trip_prices[0].partner_price} labelSpan={10} />
            <LabelWithData label='Including loading' data={trip_info.trip_prices && trip_info.trip_prices.including_loading === true ? 'Yes' : 'No'} labelSpan={10} />
            <LabelWithData label='Including Unloading' data={trip_info.trip_prices && trip_info.trip_prices.including_unloading === true ? 'yes' : 'No'} labelSpan={10} />
          </Col>
        </Row>
      </Col>
      {visible.price && <CustomerPrice visible={visible.price} onHide={onHide} />}
    </Row>
  )
}

export default TripInfo
