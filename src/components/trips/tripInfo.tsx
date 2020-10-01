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
    customer_price: get(trip_info, 'customer_price', 0),
    partner_price: get(trip_info, 'partner_price', 0),
    cash: get(trip_info, 'cash', 0),
    to_pay: get(trip_info, 'to_pay', 0),
    bank: get(trip_info, 'bank', 0),
    mamul: get(trip_info, 'mamul', 0),
    including_loading: get(trip_info, 'including_loading', 0),
    including_unloading: get(trip_info, 'including_unloading', 0),
    ton: get(trip_info, 'ton', 0),
    is_price_per_ton: get(trip_info, 'is_price_per_ton', 0),
    price_per_ton: get(trip_info, 'price_per_ton', 0),
    customer_advance_percentage: get(trip_info, 'customer_advance_percentage', null),
    partner_advance_percentage: get(trip_info, 'partner_advance_percentage.name', null)
  }
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
                  <Link href='/customers/[id]' as={`/customers/${get(trip_info, 'customer.cardcode', null)}`}>
                    <a>{get(trip_info, 'customer.name', '-')}</a>
                  </Link>
                }
              />
              <LabelAndData
                smSpan={12}
                label={<p className='mb0 b'>Partner</p>}
                data={
                  <Link href='/partners/[id]' as={`/partners/${get(trip_info, 'partner.cardcode', null)}`}>
                    <a>{get(trip_info, 'partner.name', '-')}</a>
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
                  <Link href='/trucks/[id]' as={`/trucks/${get(trip_info, 'truck.truck_no', null)}`}>
                    <a>{get(trip_info, 'truck.truck_no', '-')}</a>
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
              label='Order Date' data={trip_info && trip_info.order_date ? (
                moment(trip_info.order_date).format('DD-MMM-YY hh:mm')
              ) : ''} labelSpan={10}
            />
            <LabelWithData
              label='ETA' data={trip_info && trip_info.eta ? (
                moment(trip_info.eta).format('DD-MMM-YY hh:mm')
              ) : ''} labelSpan={10}
            />
            <LabelWithData
              label='Customer Price'
              data={
                <p className='mb0'>
                  {get(trip_info, 'customer_price', null)}{' '}
                  <EditTwoTone onClick={() => onShow('price')} />
                </p>
              }
              labelSpan={10}
            />
            <LabelWithData label='Cash' data={get(trip_info, 'cash', 0)} labelSpan={10} />
            <LabelWithData label='To Pay' data={get(trip_info, 'to_pay', 0)} labelSpan={10} />
            <LabelWithData label='Mamul' data={get(trip_info, 'mamul', 0)} labelSpan={10} />
          </Col>
          <Col sm={24} md={12}>
            <LabelWithData
              label='PO Date' data={trip_info.po_date ? (
                moment(trip_info.po_date).format('DD-MMM-YY hh:mm')
              ) : ''} labelSpan={10}
            />
            <LabelWithData label='Delay' data={get(trip_info, 'delay', 0)} labelSpan={10} />
            <LabelWithData label='Partner Price' data={get(trip_info, 'partner_price', 0)} labelSpan={10} />
            <LabelWithData label='Trip KM' data={get(trip_info, 'km', '-')} labelSpan={10} />
            <LabelWithData label='Including loading' data={get(trip_info, 'including_loading', null) ? 'Yes' : 'No'} labelSpan={10} />
            <LabelWithData label='Including Unloading' data={get(trip_info, 'including_unloading', null) ? 'Yes' : 'No'} labelSpan={10} />
          </Col>
        </Row>
      </Col>
      {visible.price && <CustomerPrice visible={visible.price} onHide={onHide} trip_price={trip_prices || {}} trip_id={trip_id} />}
    </Row>
  )
}

export default TripInfo
