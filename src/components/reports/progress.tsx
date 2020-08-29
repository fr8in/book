import Stats from './stats'
import useShowHide from '../../hooks/useShowHide'
import { Modal } from 'antd'
import get from 'lodash/get'

const Progress = (props) => {
  const { rolling_data } = props
  const initial = { report: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const data = [
    { count: get(rolling_data, 'truck', 0), name: 'Trucks' },
    { count: get(rolling_data, 'partner', 0), name: 'Partners' },
    { count: get(rolling_data, 'trip', 0), name: 'Orders' }
  ]

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
