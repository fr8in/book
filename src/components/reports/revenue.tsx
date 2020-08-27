import Stats from './stats'
import useShowHide from '../../hooks/useShowHide'
import { Modal } from 'antd'

const Revenue = (props) => {
  const { booked } = props
  const initial = { report: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const booked_in_lakhs = (booked / 100000).toFixed(1)
  const data = [
    { count: booked_in_lakhs, name: 'GMV (Bo)' },
    { count: 377.5, name: 'GMV (Bi)' },
    { count: 14.1, name: 'Revenue' }
  ]
  return (
    <>
      <Stats
        visibleStats
        data={data}
        showReport={onShow}
        period='Current Month'
        bgColor='teal'
      />
      {visible.report &&
        <Modal
          title='Revenue Report'
          visible={visible.report}
          onCancel={onHide}
        >
          <p>Report will come</p>
        </Modal>}
    </>
  )
}

export default Revenue
