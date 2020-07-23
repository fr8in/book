import Stats from './stats'
import useShowHide from '../../hooks/useShowHide'
import { Modal } from 'antd'

const data = [
  { count: 240.9, name: 'Trucks' },
  { count: 461, name: 'Partners' },
  { count: 1607, name: 'Orders' }
]

const Progress = () => {
  const initial = { report: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  return (
    <>
      <Stats
        visibleStats
        data={data}
        showReport={onShow}
        period='Last 30 day'
        bgColor='blue'
        last
      />
      {visible.report &&
        <Modal
          title='Trucks, Partners, Orders Report'
          visible={visible.report}
          onCancel={onHide}
        >
          <p>Trucks, Partners, Orders Report will come</p>
        </Modal>}
    </>
  )
}

export default Progress
