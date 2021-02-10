import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Row, Col, Modal } from 'antd'
import moment from 'moment'
import get from 'lodash/get'
import { gql, useQuery } from '@apollo/client'
import filterContext from '../../lib/filterContaxt'
import { useContext } from 'react'

const ANALYTICS_MONTHLY_CHART_QUERY = gql`
query trip_monthly(
  $branch_ids: [Int!], 
  $one_month: Int, $one_year: Int, 
  $two_month: Int, $two_year: Int, 
  $three_month: Int, $three_year: Int, 
  $four_month: Int, $four_year: Int, 
  $five_month: Int, $five_year: Int, 
  $six_month: Int, $six_year: Int
) {
  one: analytics_monthly_booking_aggregate(where: {_and: {branch_id: {_in: $branch_ids}, month: {_eq: $one_month}, year: {_eq: $one_year}}}) {
    aggregate {
      sum {
        amount
        count
      }
    }
  }
  two: analytics_monthly_booking_aggregate(where: {_and: {branch_id: {_in: $branch_ids}, month: {_eq: $two_month}, year: {_eq: $two_year}}}) {
    aggregate {
      sum {
        amount
        count
      }
    }
  }
  three: analytics_monthly_booking_aggregate(where: {_and: {branch_id: {_in: $branch_ids}, month: {_eq: $three_month}, year: {_eq: $three_year}}}) {
    aggregate {
      sum {
        amount
        count
      }
    }
  }
  four: analytics_monthly_booking_aggregate(where: {_and: {branch_id: {_in: $branch_ids}, month: {_eq: $four_month}, year: {_eq: $four_year}}}) {
    aggregate {
      sum {
        amount
        count
      }
    }
  }
  five: analytics_monthly_booking_aggregate(where: {_and: {branch_id: {_in: $branch_ids}, month: {_eq: $five_month}, year: {_eq: $five_year}}}) {
    aggregate {
      sum {
        amount
        count
      }
    }
  }
  six: analytics_monthly_booking_aggregate(where: {_and: {branch_id: {_in: $branch_ids}, month: {_eq: $six_month}, year: {_eq: $six_year}}}) {
    aggregate {
      sum {
        amount
        count
      }
    }
  }
}`

const TooltipText = (props) => {
  const { active } = props
  if (active) {
    const { payload } = props
    return (
      <div className='custom-tooltip'>
        <p className='label'>Amount: {`${payload[0].payload.amount}`}</p>
        <p className='label'>Order Count: {`${(payload[0].payload.count)}`}</p>
      </div>
    )
  }
  return null
}

const OrderReport = (props) => {
  
  const {state} = useContext(filterContext)

  const today = new Date()
  const month_num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const period = []

  for (var i = 0; i < 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    period.push({ month: month_num[d.getMonth()], year: d.getFullYear() })
  }

  const { loading, data, error } = useQuery(
    ANALYTICS_MONTHLY_CHART_QUERY,
    {
      variables: {
        branch_ids: (state.branches && state.branches.length > 0) ? state.branches : null,
        one_year: period[0].year,
        one_month: period[0].month,
        two_year: period[1].year,
        two_month: period[1].month,
        three_year: period[2].year,
        three_month: period[2].month,
        four_year: period[3].year,
        four_month: period[3].month,
        five_year: period[4].year,
        five_month: period[4].month,
        six_year: period[5].year,
        six_month: period[5].month
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  let _data = {}
  if (!loading) {
    _data = data
  }
  console.log('AnalyticsContainer Error', error)

  const one = get(_data, 'one.aggregate.sum', {})
  const two = get(_data, 'two.aggregate.sum', {})
  const three = get(_data, 'three.aggregate.sum', {})
  const four = get(_data, 'four.aggregate.sum', {})
  const five = get(_data, 'five.aggregate.sum', {})
  const six = get(_data, 'six.aggregate.sum', {})

  const report_data = [one, two, three, four, five, six]
  const trip_monthly_data = period.map((data, i) => {
    return ({ ...data, ...report_data[i] })
  })
  const trip_monthly = trip_monthly_data.map(data => {
    return ({ ...data, amount: (data.amount / 100000).toFixed(1) })
  })

  return (
    <Modal
      title='Monthly Orders and GMV'
      visible={props.visible}
      onCancel={props.onHide}
      footer={[]}
    >
      <Row>
        <Col sm={{ span: 24 }} xs={{ span: 24 }}>
          <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
            {trip_monthly && trip_monthly.length > 0
              ? (
                <BarChart width={400} height={200} style={{ margin: 'auto' }} data={trip_monthly}>
                  <XAxis dataKey='month' tickFormatter={(month) => moment(month, 'MM').format('MMM')} />
                  <YAxis />
                  <CartesianGrid strokeDasharray='3 3' />
                  <Tooltip content={<TooltipText />} />
                  <Legend />
                  <Bar dataKey='count' fill='#8884d8' name='Orders' />
                  <Bar dataKey='amount' fill='#2AB9AA' name='GMV (L)' />
                </BarChart>) : <div />}
          </div>
        </Col>
      </Row>
    </Modal>
  )
}

export default OrderReport
