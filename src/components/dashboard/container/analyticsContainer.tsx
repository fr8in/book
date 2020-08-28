import { Row, Col } from 'antd'
import Orders from '../../reports/orders'
import Revenue from '../../reports/revenue'
import Progress from '../../reports/progress'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

const ANALYTICS_QUERY = gql`
query analytics_data($month:float8!, $year: float8!, $branch_id:[Int!]){
  analytics_trip_monthly_aggregate(where: {month: {_eq: $month}, year: {_eq: $year}, branch_id: {_in: $branch_id}}) {
    aggregate {
      sum {
        trip
        booking
      }
    }
  }
}
`

const AnalyticsContainer = (props) => {
  const { filters } = props

  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1

  const { loading, data, error } = useQuery(
    ANALYTICS_QUERY,
    {
      variables: {
        branch_id: (filters.branches && filters.branches.length > 0) ? filters.branches : null,
        year: year,
        month: month
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  if (loading) return null
  console.log('AnalyticsContainer Error', error)
  const analytics = get(data, 'analytics_trip_monthly_aggregate.aggregate.sum', null)
  return (
    <Row gutter={10}>
      <Col xs={24} sm={9} md={8}>
        <Orders orders={analytics && analytics.trip} />
      </Col>
      <Col xs={24} sm={15} md={8}>
        <Revenue booked={analytics && analytics.booking} />
      </Col>
      <Col xs={24} sm={24} md={8}>
        <Progress />
      </Col>
    </Row>
  )
}

export default AnalyticsContainer
