import Stats from './stats'
import useShowHide from '../../hooks/useShowHide'
import { Modal } from 'antd'

const data = [{ count: 400, name: 'Orders' }]
const Orders = () => {
  const initial = { orders: false, report: false }
  const { visible, onShow, onHide } = useShowHide(initial)
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
      <Modal
        title='Weekly Orders'
        visible={visible.orders}
        onCancel={() => onHide('orders')}
      >
        <p>Report will come</p>
      </Modal>
      <Modal
        title='Orders Report'
        visible={visible.report}
        onCancel={() => onHide('report')}
      >
        <p>Report will come</p>
      </Modal>
    </>
  )
}

export default Orders
