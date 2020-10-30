import Stats from './stats'
import useShowHide from '../../hooks/useShowHide'
import { Modal } from 'antd'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

const ANALYTICS_QUERY = gql`
query monthly_billing($branch_ids: [Int!]) {
  analytics_monthly_billing_aggregate(where: {_and: {branch_id: {_in: $branch_ids}}}) {
    aggregate {
      sum {
        receivable ## billing GMV
        count
        revenue ## Commmision
      }
    }
  }
}`

const Revenue = (props) => {
  const { filters } = props

  const initial = { report: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  // const year = new Date().getFullYear()
  // const month = new Date().getMonth() + 1

  const { loading, data, error } = useQuery(
    ANALYTICS_QUERY,
    {
      variables: {
        branch_ids: (filters.branches && filters.branches.length > 0) ? filters.branches : null
      }
    }
  )
  let _data = {}
  if (!loading) {
    _data = data
  }
  console.log('AnalyticsContainer Error', error)
  const analytics = get(_data, 'analytics_monthly_billing_aggregate.aggregate.sum', null)
  const receivable = get(analytics, 'receivable', 0) / 100000
  const revenue = get(analytics, 'revenue', 0) / 100000

  const stats_data = [
    { count: receivable.toFixed(1), name: 'GMV (Bi)' },
    { count: revenue.toFixed(1), name: 'Revenue' }
  ]
  return (
    <>
      <Stats
        visibleStats
        data={stats_data}
        showReport={onShow}
        period='Current Month'
        bgColor='teal'
      />
      {visible.report &&
        <Modal
          title='Revenue Report'
          visible={visible.report}
          onCancel={onHide}
          width={550}
          footer={null}
        >
          <div className='truckStatusReport'>
            <iframe
              width='100%'
              height='100%'
              src='https://app.powerbi.com/view?r=eyJrIjoiZTE4NjQ0MmMtMDE4NC00MzNiLWJlYTktMzg3MGY3ZjIzZTM2IiwidCI6IjE5ZWE5NTViLTE1MzYtNGM3Ni04NDIwLTUxZmJjNGM5YzM5NyIsImMiOjEwfQ=='
            />
          </div>
        </Modal>}
    </>
  )
}

export default Revenue
