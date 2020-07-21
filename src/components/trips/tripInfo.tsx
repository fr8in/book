import { Row, Col, Divider } from 'antd'
import LabelAndData from '../common/labelAndData'
import LabelWithData from '../common/labelWithData'
import Link from 'next/link'
import {EditTwoTone} from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import CustomerPrice from '../trips/customerPrice'
const TripInfo = (props) => {
  const initial = {  price:false}
  const { visible, onShow,onHide } = useShowHide(initial)
  const { data } = props
  return (
    <Row>
      <Col xs={24}>
        <Row>
          <Col flex='auto'>
            <Row>
              <LabelAndData
                colSpan={12}
                label={<p className='mb0 b'>Customer</p>}
                data={
                  <Link href='/customers/[id]' as={`/customers/${data.customer.cardCode}`}>
                    <a>{data.customer.name}</a>
                  </Link>
                }
              />
              <LabelAndData
                colSpan={12}
                label={<p className='mb0 b'>Partner</p>}
                data={
                  <Link href='/partners/[id]' as={`/partners/${data.partner.cardCode}`}>
                    <a>{data.partner.name}</a>
                  </Link>
                }
              />
            </Row>
          </Col>
          <Col flex='120px'>
            <Row>
              <LabelAndData
                colSpan={24}
                label={<p className='mb0 b'>Truck No</p>}
                data={
                  <Link href='/trucks/[id]' as={`/truck/${data.device.deviceId}`}>
                    <a>{data.device.truckNo}</a>
                  </Link>
                }
              />
            </Row>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col sm={24} md={12}>
            <LabelWithData label='Order Date' data={data.trip.orderDate} labelSpan={10} />
            <LabelWithData label='ETA' data={data.trip.ETA} labelSpan={10} />
            <LabelWithData label='Customer Price' data={[data.priceDetail.customerPrice ,
            <EditTwoTone onClick={() => onShow('price')}/>]} labelSpan={10} />
            <LabelWithData label='Cash' data={data.priceDetail.cash} labelSpan={10} />
            <LabelWithData label='To Pay' data={data.priceDetail.toPay} labelSpan={10} />
            <LabelWithData label='Mamul' data={data.priceDetail.mamul} labelSpan={10} />
          </Col>
          {visible.price && <CustomerPrice visible={visible.price} onHide={() => onHide('price')} />}
          <Col sm={24} md={12}>
            <LabelWithData label='PO Date' data={data.trip.poDate} labelSpan={10} />
            <LabelWithData label='Delay' data={data.trip.delay} labelSpan={10} />
            <LabelWithData label='Partner Price' data={data.priceDetail.partnerPrice} labelSpan={10} />
            <LabelWithData label='Including loading' data={data.priceDetail.includingLoading} labelSpan={10} />
            <LabelWithData label='Including Unloading' data={data.priceDetail.includingUnloading} labelSpan={10} />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default TripInfo
