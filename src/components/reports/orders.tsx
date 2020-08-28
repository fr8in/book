import Stats from './stats'
import useShowHide from '../../hooks/useShowHide'
import WeeklyBranchTarget from '../partners/weeklyBranchTarget'
import OrderReport from '../partners/orderReport'

const Orders = (props) => {
  const { orders } = props
  const initial = { orders: false, report: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const data = [{ count: orders, name: 'Orders' }]
  return (
    <>
      <Stats
        visibleOrders
        visibleStats
        data={data}
        showReport={onShow}
        period='Current Month'
        bgColor='yellow'
      />
      {visible.orders && <WeeklyBranchTarget visible={visible.orders} onHide={onHide} />}
      {visible.report && <OrderReport visible={visible.report} onHide={onHide} />}
    </>
  )
}

export default Orders
