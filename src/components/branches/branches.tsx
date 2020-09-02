import React from 'react'
import { Table, Tag } from 'antd'
import { EditTwoTone } from '@ant-design/icons'
import AddTraffic from '../branches/addTraffic'
import WeeklyTarget from '../branches/weeklytarget'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import u from '../../lib/util'

const BRANCHES_QUERY = gql`
subscription branches($week: Int!, $year: Int!) {
  branch(order_by: {displayposition: asc}) {
    id
    name
    displayposition
    branch_weekly_targets(where: {week: {_eq: $week}, year: {_eq: $year}}) {
      trip_target
    }
    branch_employees {
      id
      is_manager
      employee {
        id
        name
        mobileno
      }
    }
    cities {
      id
      name
    }
  }
}`

const Branches = () => {
  const initial = {
    trafficVisible: false,
    title: null,
    trafficData: []
  }

  const period = u.getWeekNumber(new Date())
  console.log('period', period)

  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const { loading, data, error } = useSubscription(
    BRANCHES_QUERY,
    {
      variables: { week: period.week, year: period.year }
    }
  )

  console.log('Branches Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const branches = get(_data, 'branch', [])

  const column = [
    {
      title: 'Branch Name',
      dataIndex: 'name',
      width: '10%'
    },
    {
      title: 'Connected City',
      dataIndex: 'connectedCity',
      key: 'connectedCity',
      width: '30%',
      render: (text, record) =>
        record.cities.length > 0
          ? record.cities.map((data, i) => (
            <Tag className='small-tag' key={i}>
              {data.name}
            </Tag>
          ))
          : null
    },
    {
      title: 'Traffic Members',
      dataIndex: 'trafficMembers',
      key: 'trafficMembers',
      width: '48%',
      render: (text, record) => {
        return (
          <div className='cell-wrapper'>
            <span>
              {record.branch_employees
                ? record.branch_employees.map((data, i) => {
                  const mobile = get(data, 'employee.mobileno', '-')
                  const name = get(data, 'employee.name', '-')
                  return (
                    <Tag
                      key={i}
                      className='small-tag'
                      color={data.is_manager ? 'blue' : null}
                    >
                      <span>{`${mobile} - ${name}`}</span>
                    </Tag>
                  )
                })
                : null}
            </span>
            {
              <EditTwoTone
                type='edit'
                className='cell-icon'
                onClick={() =>
                  handleShow('trafficVisible', record.name, 'trafficData', record)}
              />
            }
          </div>
        )
      }
    },
    {
      title: 'Weekly Target',
      width: '12%',
      render: (text, record) => {
        const target = get(record, 'branch_weekly_targets[0].trip_target', 0)
        return <WeeklyTarget id={record.id} label={target} Week={period.week} Year={period.year}/>
      }
    }
  ]

  return (
    <>
      <Table
        columns={column}
        dataSource={branches}
        size='small'
        scroll={{ x: 800 }}
        pagination={false}
        rowKey={record => record.id}
        loading={loading}
      />
      {object.trafficVisible && (
        <AddTraffic
          visible={object.trafficVisible}
          onHide={handleHide}
          branch_data={object.trafficData}
          title={object.title}
        />
      )}
    </>
  )
}

export default Branches
