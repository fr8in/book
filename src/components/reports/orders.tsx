import Stats from './stats'
import useShowHide from '../../hooks/useShowHide'
import { Modal, Button } from 'antd'
import WeeklyBranchTarget from '../partners/weeklyBranchTarget'

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
        style={{ top: 20 }}
        bodyStyle={{ padding: 10 }}
        visible={visible.orders}
        onCancel={() => onHide('orders')}
        closable={false}
        footer={[
          <Button
            type='default'
            key='back'
            onClick={() => onHide('orders')}
          >
            Close
          </Button>
        ]}
      >
        <WeeklyBranchTarget />
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
