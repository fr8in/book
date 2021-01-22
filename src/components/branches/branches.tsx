import { useEffect } from 'react'
import { Table, Tag } from 'antd'
import AddTraffic from '../branches/addTraffic'
import WeeklyTarget from '../branches/weeklyTarget'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import u from '../../lib/util'
import EditAccess from '../common/editAccess'
import sumBy from 'lodash/sumBy'

const BRANCHES_QUERY = gql`
subscription branches($week: Int!, $year: Int!) {
  branch(order_by: {displayposition: asc}) {
    id
    name
    displayposition
    branch_employees {
      customer_branch_employees_aggregate {
        aggregate {
          count
        }
      }
      id
      is_manager
      employee {
        id
        name
        mobileno
        email
      }
    }
    branch_employee_weekly_targets(where: {year: {_eq: $year}, week: {_eq: $week}, deleted_at: {_is_null: true}}, order_by: {employee_id: desc}) {
      id
      trip_target
      employee_id
      branch_id
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
}

`

const Branches = (props) => {
  const { edit_access, setTotalBranch } = props

  const { role } = u
  const traffic_member_delete = [role.admin, role.hr]
  const initial = {
    trafficVisible: false,
    title: null,
    trafficData: [],
    targetVisible: false,
    targetData:{}
  }

  const period = u.getWeekNumber(new Date())
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const { loading, data, error } = useSubscription(
    BRANCHES_QUERY,
    {
      variables: { week: period.week, year: period.year }
    }
  )


  let _data = {}
  if (!loading) {
    _data = data
  }

  const branches = get(_data, 'branch', [])
  const total_branch = branches.length

  useEffect(() => {
    setTotalBranch(total_branch)
  }, [branches])

  const column = [
    {
      title: 'Branch Name',
      dataIndex: 'name',
      width: '10%'
    },
    {
      title: 'Connected City',
      dataIndex: 'connectedCity',
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
      width: '40%',
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
            <EditAccess
              edit_access={edit_access}
              onEdit={() => handleShow('trafficVisible', record.name, 'trafficData', record)}
            />
          </div>
        )
      }
    },
    {
      title: 'Weekly Target',
      width: '29%',
      render: (text, record) => {
        const array = record.branch_employee_weekly_targets
        const total = sumBy(array, 'trip_target')
        return (
          <>   {total} <EditAccess
            edit_access={edit_access}
            onEdit={() => handleShow('targetVisible', record.trip_target, 'targetData', record)}
          />
          </>
        )
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
          edit_access_delete={traffic_member_delete}
          week={period.week}
          year={period.year}
        />
      )}
      {object.targetVisible && (
        <WeeklyTarget
          visible={object.targetVisible}
          onHide={handleHide}
          data={object.targetData}
          title={object.title}
          edit_access_delete={traffic_member_delete}
          week={period.week}
          year={period.year}
        />
      )}
    </>
  )
}

export default Branches
