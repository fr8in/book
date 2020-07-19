import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Row, Col } from 'antd'
import moment from 'moment'
import data from '../../../mock/partner/orderReport'

const TooltipText = (props) => {
  const { active } = props
  if (active) {
    const { payload } = props
    return (
      <div className='custom-tooltip'>
        <p className='label'>Month: {`${moment(payload[0].payload.month, 'MM').format('MMM')}`}</p>
        <p className='label'>Order Count: {`${((payload[0].payload.orderCount) * 100).toFixed(0)}`}</p>
        {/* <p className="label">Target: {`${((payload[0].payload.targetCount) * 100).toFixed(0)}`}</p> */}
      </div>
    )
  }
  return null
}
const OrderReport = () => {
  return (
    <Row>
      <Col sm={{ span: 24 }} xs={{ span: 24 }}>
        <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
          {data && data.length > 0
            ? (
              <BarChart width={400} height={200} style={{ margin: 'auto' }} data={data}>
                <XAxis dataKey='month' tickFormatter={(month) => moment(month, 'MM').format('MMM')} />
                <YAxis />
                <CartesianGrid strokeDasharray='3 3' />
                <Tooltip content={<TooltipText />} />
                <Legend />
                <Bar dataKey='orderCount' fill='#8884d8' name='Completed Orders' />
              </BarChart>) : <div />}
        </div>
      </Col>
    </Row>
  )
}

export default OrderReport
