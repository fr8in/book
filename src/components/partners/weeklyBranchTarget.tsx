import Title from '../common/title'
import moment from 'moment'
import { Table, Tag, Modal, Button } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import sumBy from 'lodash/sumBy'

const WEEKLY_TARGET_QUERY = gql`
subscription monthly($week1: Int!,$week2: Int!,$week3: Int!, $year1: Int!, $year2: Int!, $year3: Int!) {
  branch(order_by:{displayposition: asc}) {
    id
    name
    displayposition
    week1: weekly_booking(where: {_and: {week: {_eq: $week1}, year: {_eq: $year1}}}) {
      trip_actual
      trip_target
      branch_id
      week
      year
    }
    week2: weekly_booking(where: {_and: {week: {_eq: $week2}, year: {_eq: $year2}}}) {
      trip_actual
      trip_target
      branch_id
      week
      year
    }
    week3: weekly_booking(where: {_and: {week: {_eq: $week3}, year: {_eq: $year3}}}) {
      trip_actual
      trip_target
      branch_id
      week
      year
    }
  }
}
`

const WeeklyBranchTarget = (props) => {
  const { visible, onHide } = props

  const cw = moment().format('WW yyyy').split(' ') // Current Week
  const lw = moment().subtract(1, 'weeks').format('WW yyyy').split(' ') // Last Week
  const blw = moment().subtract(2, 'weeks').format('WW yyyy').split(' ') // Before Last Week
  

  const week = [parseInt(cw[0], 10), parseInt(lw[0], 10), parseInt(blw[0], 10)]
  console.log('week',week)
  const year = (cw[1] === blw[1]) ? [parseInt(cw[1], 10)] : [parseInt(cw[1], 10), parseInt(blw[1], 10)]
  console.log('year',year)

  const { loading, data, error } = useSubscription(
    WEEKLY_TARGET_QUERY,
    {
      variables: {
        week1: week[0],
        week2: week[1],
        week3: week[2],
        year1: year[0],
        year2: (year.length > 1 ? year[1] : year[0]),
        year3: (year.length > 1 ? year[1] : year[0])
      }
    }
  )

  console.log('WeeklyBranchTarget Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const branch = get(_data, 'branch', [])

  const branchTargetWeekly = branch.map(data => {
    const targetAvg = get(data, 'week1[0].trip_target', 0) / 7
    const d = new Date()
    const startFromSunday = d.getDay() + 1 // FR8 week start at sunday
    const n = startFromSunday > 7 ? 1 : startFromSunday
    const week_day_target = (Math.floor(targetAvg * n))
    return { week_day_target, ...data }
  })

  const w1_actual = sumBy(branch, 'week1[0].trip_actual')
  const w1_target = sumBy(branch, 'week1[0].trip_target')
  const w2_actual = sumBy(branch, 'week2[0].trip_actual')
  const w2_target = sumBy(branch, 'week2[0].trip_target')
  const w3_actual = sumBy(branch, 'week3[0].trip_actual')
  const w3_target = sumBy(branch, 'week3[0].trip_target')

  const currentMonthTitle = (
    <Title
      name={<div>{`W - ${week[0]}`}</div>}
      data={`${w1_actual || 0} / ${w1_target || 0}`}
      alignRight
    />)
  const lastMonthTitle = (
    <Title
      name={<div>{`W - ${week[1]}`}</div>}
      data={`${w2_actual || 0} / ${w2_target || 0}`}
     alignRight
    />)
  const beforeLastMonthTitle = (
    <Title
      name={<div>{`W - ${week[2]}`}</div>}
      data={`${w3_actual || 0} / ${w3_target || 0}`}
      alignRight
    />)

  const columns = [
    {
      title: 'Branch',
      dataIndex: 'name',
      width: '24%'
    },
    {
      title: currentMonthTitle,
      width: '24%',
      className: 'alignRight',
      render: (text, record) => {
        const actual = get(record, 'week1[0].trip_actual', 0)
        const target = get(record, 'week1[0].trip_target', 0)
        return (
          <span>
            {`${actual} / ${record.week_day_target} `}
            <Tag style={{ width: 31, textAlign: 'center' }}>{target || 0}</Tag>
          </span>
        )
      }
    },
    {
      title: lastMonthTitle,
      width: '24%',
      className: 'alignRight',
      render: (text, record) => {
        const actual = get(record, 'week2[0].trip_actual', 0)
        const target = get(record, 'week2[0].trip_target', 0)
        return (
          <span>{`${actual} / ${target || 0}`}</span>
        )
      }
    },
    {
      title: beforeLastMonthTitle,
      width: '24%',
      className: 'alignRight',
      render: (text, record) => {
        const actual = get(record, 'week3[0].trip_actual', 0)
        const target = get(record, 'week3[0].trip_target', 0)
        return (
          <span>{`${actual} / ${target || 0}`}</span>
        )
      }
    }

  ]

  return (
    <Modal
      style={{ top:2 }}
      bodyStyle={{ padding: 10 }}
      visible={visible}
      onCancel={onHide}
      closable={false}
      width={560}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={branchTargetWeekly}
        size='small'
        pagination={false}
        scroll={{ x: 400, y: 520 }}
        rowKey={record => record.id}
        className='weeklyTarget'
        loading={loading}
      />
    </Modal>
  )
}

export default WeeklyBranchTarget
