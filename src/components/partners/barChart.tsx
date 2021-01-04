import { Card } from 'antd'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import moment from 'moment'
import u from '../../lib/util'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

const ANALYTICS_PARTNER_MONTHLY_QUERY = gql`
query partner_monthly($partner_id:Int $one_month: Int, $one_year: Int, $two_month: Int, $two_year: Int, $three_month: Int, $three_year: Int, $four_month: Int, $four_year: Int, $five_month: Int, $five_year: Int, $six_month: Int, $six_year: Int) {
  analytics_partner_monthly(where:{_or:[
    {_and:[{month:{_eq:$one_month}},{year:{_eq:$one_year}}] },
    {_and:[{month:{_eq:$two_month}},{year:{_eq:$two_year}}] },
    {_and:[{month:{_eq:$three_month}},{year:{_eq:$three_year}}] },
    {_and:[{month:{_eq:$four_month}},{year:{_eq:$four_year}}] },
    {_and:[{month:{_eq:$five_month}},{year:{_eq:$five_year}}] },
    {_and:[{month:{_eq:$six_month}},{year:{_eq:$six_year}}] } 
  ],partner_id:{_eq:$partner_id}})
  {
    partner_id
    month
    year
    trip_count
    gmv
  }
}
`
const ReportBarChart = (props) => {
  
  const {partner_id}= props
 
  const period = u.getLastSixMonth()

  const { loading, data, error } = useQuery(
    ANALYTICS_PARTNER_MONTHLY_QUERY,
    {
      variables: {
        partner_id: partner_id,
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
  console.log('error',error)
  
  let _data = {}
  if (!loading) {
    _data = data
  }
 const order_report = get(_data,'analytics_partner_monthly',null)
 
  const partner_order_report = order_report ? order_report.map(partnerOrder => {
    return {
      month: moment(partnerOrder.month.toString()).format('MMM'),
      MonthlyEarnings:(partnerOrder.gmv / 100000).toFixed(1)
    }}):null

  return (
    <Card size='small'>
      <BarChart width={360} height={220} data={partner_order_report} margin={{ top: 0  }} id='monthlyReport'>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='month' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar barSize={30} name='Earnings(In Lakhs)' dataKey='MonthlyEarnings' fill='#669ae5'>
        </Bar>
      </BarChart>
    </Card>
  )
}

export default ReportBarChart
