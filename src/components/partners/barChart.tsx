import { Card } from 'antd'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import moment from 'moment'
import { partnerMemberShip } from '../../../mock/partner/membershipReport'

const ReportBarChart = () => {
  const data = partnerMemberShip ? partnerMemberShip.map(data => {
    return {
      month: moment(data.month.toString()).format('MMM'),
      TruckCount: data.truckCount,
      MonthlyEarnings: data.earnings,
      partnerTypeId: data.partnerTypeId
    }
  }) : null
  return (
    <Card size='small'>
      <BarChart width={360} height={220} data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='month' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar barSize={20} name='Trucks(Count)' dataKey='TruckCount' fill='#34BF95' />
        <Bar barSize={20} name='Earnings(In Lakhs)' dataKey='MonthlyEarnings' fill='#CDCF24'>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.partnerTypeId === 1 ? '#D7D7D7' : '#C9B037'} />
          ))}
        </Bar>
      </BarChart>
    </Card>
  )
}

export default ReportBarChart
