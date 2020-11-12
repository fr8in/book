import Stats from './stats'
import useShowHide from '../../hooks/useShowHide'
import OrderReport from '../partners/orderReport'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

const ANALYTICS_QUERY = gql`
query monthly_orders($branch_ids: [Int!], $month: Int!,$year:Int!) {
  analytics_monthly_booking_aggregate(where: {_and: 
    {
      branch_id: {_in: $branch_ids}, 
      month: {_eq: $month},
      year: {_eq: $year}
    
    }}) {
    aggregate {
      sum {
        amount
        count
      }
    }
  }
}
`

const Orders = (props) => {
  const { filters } = props

  const initial = { orders: false, report: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1

  const { loading, data, error } = useQuery(
    ANALYTICS_QUERY,
    {
      variables: {
        branch_ids: (filters.branches && filters.branches.length > 0) ? filters.branches : null,
        month: month,
        year: year
      }
    }
  )
  let _data = {}
  if (!loading) {
    _data = data
  }
  console.log('AnalyticsContainer Error', error)
  const analytics = get(_data, 'analytics_monthly_booking_aggregate.aggregate.sum', null)
  const booked = get(analytics, 'amount', 0)
  const revenue = booked* 0.04 

  const stats_data = [
    { count: get(analytics, 'count', 0), name: 'Orders' },
    { count: booked ? (booked / 100000).toFixed(1) : 0, name: 'GMV (Bo)' },
    { count: revenue.toFixed(1), name: 'Revenue' }
  ]
  return (
    <>
      <Stats
        visibleStats
        data={stats_data}
        showReport={onShow}
        period='Current Month'
        bgColor='yellow'
      />
      {visible.report && <OrderReport visible={visible.report} onHide={onHide} filters={filters} />}
    </>
  )
}

export default Orders
