import { Row, Col, Divider } from 'antd'
import LabelAndData from '../common/labelAndData'
import LabelWithData from '../common/labelWithData'
import Link from 'next/link'
import { EditTwoTone } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import CustomerPrice from '../trips/customerPrice'
import moment from 'moment'
import get from 'lodash/get'

const TripInfo = (props) => {
  const { trip_info, trip_id } = props
  const initial = { price: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const trip_prices = {
    customer_price: trip_info.customer_price,
    partner_price: trip_info.partner_price,
    cash: trip_info.cash,
    to_pay: trip_info.to_pay,
    bank: trip_info.bank,
    mamul: trip_info.mamul,
    including_loading: trip_info.including_loading,
    including_unloading: trip_info.including_unloading,
    ton: trip_info.ton,
    is_price_per_ton: trip_info.is_price_per_ton,
    price_per_ton: trip_info.price_per_ton,
    customer_advance_percentage: trip_info.customer_advance_percentage,
    partner_advance_percentage: get(trip_info, 'partner_advance_percentage.name', null)
  }
  console.log('trip_price', trip_prices)
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
                  <Link href='/trucks/[id]' as={`/trucks/${trip_info.truck && trip_info.truck.truck_no}`}>
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
              data={
                <p>{trip_info && trip_info.customer_price ? trip_info.customer_price : null}
                  <EditTwoTone onClick={() => onShow('price')} />
                </p>
              }
              labelSpan={10}
            />
            <LabelWithData label='Cash' data={trip_info && trip_info.cash ? trip_info.cash : 0} labelSpan={10} />
            <LabelWithData label='To Pay' data={trip_info && trip_info.to_pay ? trip_info.to_pay : 0} labelSpan={10} />
            <LabelWithData label='Mamul' data={trip_info && trip_info.mamul ? trip_info.mamul : 0} labelSpan={10} />
          </Col>
          <Col sm={24} md={12}>
            <LabelWithData
              label='PO Date' data={trip_info.po_date ? (
                moment(trip_info.po_date).format('DD-MMM-YYYY hh:mm')
              ) : ''} labelSpan={10}
            />
            <LabelWithData label='Delay' data={trip_info.delay} labelSpan={10} />
            <LabelWithData label='Partner Price' data={trip_info && trip_info.partner_price ? trip_info.partner_price : 0} labelSpan={10} />
            <LabelWithData label='Including loading' data={trip_info && trip_info.including_loading === true ? 'Yes' : 'No'} labelSpan={10} />
            <LabelWithData label='Including Unloading' data={trip_info && trip_info.including_unloading === true ? 'yes' : 'No'} labelSpan={10} />
          </Col>
        </Row>
      </Col>
      {visible.price && <CustomerPrice visible={visible.price} onHide={onHide} trip_price={trip_prices || {}} trip_id={trip_id} />}
    </Row>
  )
}

export default TripInfo
