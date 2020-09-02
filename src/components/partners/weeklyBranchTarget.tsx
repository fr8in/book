import Title from '../common/title'
import moment from 'moment'
import { Table, Tag, Modal, Button } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import sumBy from 'lodash/sumBy'

const WEEKLY_TARGET_QUERY = gql`
subscription monthly($week: [Int!], $year: [Int!]) {
  analytics_weekly_booking(where: {_and: {week: {_in: $week}, year: {_in: $year}}}, order_by: {displayposition: asc}) {
    trip_actual
    trip_target
    branch_id
    displayposition
    week
    year
    branch{
      name
    }
  }
}
`

const WeeklyBranchTarget = (props) => {
  const { visible, onHide } = props

  const cw = moment('2020-08-18').format('ww yyyy').split(' ') // Current Week
  const lw = moment('2020-08-18').subtract(1, 'weeks').format('ww yyyy').split(' ') // Last Week
  const blw = moment('2020-08-18').subtract(2, 'weeks').format('ww yyyy').split(' ') // Before Last Week

  const week = [parseInt(cw[0], 10), parseInt(lw[0], 10), parseInt(blw[0], 10)]
  const year = (cw[1] === blw[1]) ? [parseInt(cw[1], 10)] : [parseInt(cw[1], 10), parseInt(blw[1], 10)]

  const { loading, data, error } = useSubscription(
    WEEKLY_TARGET_QUERY,
    {
      variables: { week: week, year: year }
    }
  )

  console.log('WeeklyBranchTarget Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const weekly_booking = get(_data, 'analytics_weekly_booking', [])

  const w1 = weekly_booking.filter(data => data.week === week[0] && data.year === year[0])
  const w2 = weekly_booking.filter(data => data.week === week[1] && data.year === (year.length > 1 ? year[1] : year[0]))
  const w3 = weekly_booking.filter(data => data.week === week[2] && data.year === (year.length > 1 ? year[1] : year[0]))

  const weekly_target = w1.map((data, i) => {
    return ({
      branch_id: data.branch_id,
      branch_name: get(data, 'branch.name', null),
      displayposition: data.displayposition,
      w1: {
        week: data.week,
        year: data.year,
        trip_actual: data.trip_actual,
        trip_target: data.trip_target
      },
      w2: {
        week: (w2[i] && w2[i].branch_id) === data.branch_id ? w2[i].week : null,
        year: (w2[i] && w2[i].branch_id) === data.branch_id ? w2[i].year : null,
        trip_actual: (w2[i] && w2[i].branch_id) === data.branch_id ? w2[i].trip_actual : null,
        trip_target: (w2[i] && w2[i].branch_id) === data.branch_id ? w2[i].trip_target : null
      },
      w3: {
        week: (w3[i] && w3[i].branch_id) === data.branch_id ? w3[i].week : null,
        year: (w3[i] && w3[i].branch_id) === data.branch_id ? w3[i].year : null,
        trip_actual: (w3[i] && w3[i].branch_id) === data.branch_id ? w3[i].trip_actual : null,
        trip_target: (w3[i] && w3[i].branch_id) === data.branch_id ? w3[i].trip_target : null
      }
    })
  })
  console.log('WeeklyBranchTarget weekly_booking', weekly_target)

  const branchTargetWeekly = weekly_target.map(data => {
    const targetAvg = get(data, 'w1.trip_target', 0) / 7
    const d = new Date()
    const startFromSunday = d.getDay() + 1 // FR8 week start at sunday
    const n = startFromSunday > 7 ? 1 : startFromSunday
    const week_day_target = (Math.floor(targetAvg * n))
    return { week_day_target, ...data }
  })

  const w1_actual = sumBy(weekly_target, 'w1.trip_actual')
  const w1_target = sumBy(weekly_target, 'w1.trip_target')
  const w2_actual = sumBy(weekly_target, 'w2.trip_actual')
  const w2_target = sumBy(weekly_target, 'w2.trip_target')
  const w3_actual = sumBy(weekly_target, 'w3.trip_actual')
  const w3_target = sumBy(weekly_target, 'w3.trip_target')

  const currentMonthTitle = (
    <Title
      name={<div>{`W - ${week[0]}`}</div>}
      data={w1_actual + '/' + w1_target}
    />)
  const lastMonthTitle = (
    <Title
      name={<div>{`W - ${week[1]}`}</div>}
      data={w2_actual + '/' + w2_target}
    />)
  const beforeLastMonthTitle = (
    <Title
      name={<div>{`W - ${week[2]}`}</div>}
      data={w3_actual + '/' + w3_target}
    />)

  const columns = [
    {
      title: 'Branch',
      dataIndex: 'branch_name',
      width: '24%'
    },
    {
      title: currentMonthTitle,
      width: '28%',
      className: 'alignRight',
      render: (text, record) => {
        const actual = get(record, 'w1.trip_actual')
        const target = get(record, 'w1.trip_target')
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
        const actual = get(record, 'w2.trip_actual')
        const target = get(record, 'w2.trip_target')
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
        const actual = get(record, 'w3.trip_actual')
        const target = get(record, 'w3.trip_target')
        return (
          <span>{`${actual} / ${target || 0}`}</span>
        )
      }
    }

  ]

  return (
    <Modal
      style={{ top: 20 }}
      bodyStyle={{ padding: 10 }}
      visible={visible}
      onCancel={onHide}
      closable={false}
      footer={[
        <Button
          type='default'
          key='back'
          onClick={onHide}
        >
            Close
        </Button>
      ]}
    >
      <Table
        columns={columns}
        dataSource={branchTargetWeekly}
        size='small'
        pagination={false}
        scroll={{ x: 400, y: 420 }}
        rowKey={record => record.branch_id}
        className='weeklyTarget'
      />
    </Modal>
  )
}

export default WeeklyBranchTarget
