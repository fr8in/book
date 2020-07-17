import u from '../../lib/util'
import weeklyTarget from '../../../mock/partner/weeklyBranchTarget'
import Title from '../common/title'
import moment from 'moment'
import { Table, Tag } from 'antd'

const WeeklyBranchTarget = () => {
  const sortedWeeklyTarget = weeklyTarget.sort(u.objSort)

  const branchTargetWeekly = sortedWeeklyTarget.map(data => {
    const targetAvg = data.currentTarget / 7
    const d = new Date()
    const startFromSunday = d.getDay() + 1 // FR8 week start at sunday
    const n = startFromSunday > 7 ? 1 : startFromSunday
    const weekDayTarget = (Math.floor(targetAvg * n))
    return { weekDayTarget, ...data }
  })

  const currentActualSum = weeklyTarget.map(item => item.currentActual).reduce((prev, curr) => prev + curr, 0)
  const currentTargetSum = weeklyTarget.map(item => item.currentTarget).reduce((prev, curr) => prev + curr, 0)
  const lastActualSum = weeklyTarget.map(item => item.lastActual).reduce((prev, curr) => prev + curr, 0)
  const lastTargetSum = weeklyTarget.map(item => item.lastTarget).reduce((prev, curr) => prev + curr, 0)
  const beforeLastActualSum = weeklyTarget.map(item => item.beforeLastActual).reduce((prev, curr) => prev + curr, 0)
  const beforeLastTargetSum = weeklyTarget.map(item => item.beforeLastTarget).reduce((prev, curr) => prev + curr, 0)

  const sumOfTarget = {
    currentActualSum,
    currentTargetSum,
    lastActualSum,
    lastTargetSum,
    beforeLastActualSum,
    beforeLastTargetSum
  }

  const currentMonth = moment().format('ww')
  const lastMonth = moment().subtract(1, 'weeks').format('ww')
  const beforeLastMonth = moment().subtract(2, 'weeks').format('ww')

  const currentMonthTitle = <Title
    name={'Week - ' + currentMonth}
    data={sumOfTarget && sumOfTarget.currentActualSum + '/' + sumOfTarget.currentTargetSum}
  />
  const lastMonthTitle = <Title
    name={'Week - ' + lastMonth}
    data={sumOfTarget && sumOfTarget.lastActualSum + '/' + sumOfTarget.lastTargetSum}
  />
  const beforeLastMonthTitle = <Title
    name={'Week - ' + beforeLastMonth}
    data={sumOfTarget && sumOfTarget.beforeLastActualSum + '/' + sumOfTarget.beforeLastTargetSum}
  />

  const columns = [
    {
      title: 'Branch',
      dataIndex: 'branchName',
      key: 'branchName',
      width: '31%'
    },
    {
      title: currentMonthTitle,
      dataIndex: 'currentActual',
      key: 'currentActuals',
      width: '23%',
      className: 'alignRight',
      render: (text, record) => {
        return (
          <span>
            <span>
              {`${record.currentActual} / ${record.weekDayTarget} `}
            </span>
            <Tag style={{ width: 31, textAlign: 'center' }}>{record.currentTarget}</Tag>
          </span>
        )
      }
    },
    {
      title: lastMonthTitle,
      dataIndex: 'lastActual',
      key: 'lastActual',
      width: '23%',
      className: 'alignRight',
      render: (text, record) => {
        return (
          <span>
            {record.lastActual + '/' + record.lastTarget}
          </span>
        )
      }
    },
    {
      title: beforeLastMonthTitle,
      dataIndex: 'beforeLastMonth',
      key: 'beforeLastMonth',
      width: '23%',
      className: 'alignRight',
      render: (text, record) => {
        return (
          <span>
            {record.beforeLastActual + '/' + record.beforeLastTarget}
          </span>
        )
      }
    }

  ]

  return (
    <Table
      columns={columns}
      dataSource={branchTargetWeekly}
      size='middle'
      pagination={false}
      scroll={{ x: 400, y: '100%' }}
      rowKey={record => record.orderBranchId}
    />
  )
}

export default WeeklyBranchTarget
