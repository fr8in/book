import Stats from './stats'
import useShowHide from '../../hooks/useShowHide'
import { Modal } from 'antd'

const data = [
  { count: 240.9, name: 'GMV (Bo)' },
  { count: 377.5, name: 'GMV (Bi)' },
  { count: 13.1, name: 'Revenue' }
]
const Revenue = () => {
  const initial = { report: false }
  const { visible, onShow, onHide } = useShowHide(initial)
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
