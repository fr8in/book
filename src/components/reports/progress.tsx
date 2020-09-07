import Stats from './stats'
import useShowHide from '../../hooks/useShowHide'
import { Modal } from 'antd'
import get from 'lodash/get'
import { gql, useSubscription } from '@apollo/client'

const ANALYTICS_QUERY = gql`
subscription rolling {
  analytics_rolling {
    partner
    customer
    truck
    trip
  }
}
`

const Progress = (props) => {
  const initial = { report: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const { loading, data, error } = useSubscription(ANALYTICS_QUERY)

  let _data = {}
  if (!loading) {
    _data = data
  }
  console.log('Progress Error', error)
  const analytics = get(_data, 'analytics_rolling[0]', null)

  const stats_data = [
    { count: get(analytics, 'truck', 0), name: 'Trucks' },
    { count: get(analytics, 'partner', 0), name: 'Partners' },
    { count: get(analytics, 'trip', 0), name: 'Orders' }
  ]

  return (
    <>
      <Stats
        visibleStats
        data={stats_data}
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
          footer={null}
        >
          <div className='truckStatusReport'>
            <iframe
              width='100%'
              height='100%'
              src='https://app.powerbi.com/view?r=eyJrIjoiOTI5ZjhmMjktYTJlMC00ZDRmLTlmZDYtNjY0N2U4OTc5YTEyIiwidCI6IjE5ZWE5NTViLTE1MzYtNGM3Ni04NDIwLTUxZmJjNGM5YzM5NyIsImMiOjEwfQ=='
            />
          </div>
        </Modal>}
    </>
  )
}

export default Progress
