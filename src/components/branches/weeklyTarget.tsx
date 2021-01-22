import { gql, useMutation, useSubscription } from '@apollo/client';
import { message, Table } from 'antd'
import EditableCell from '../common/editableCell'
import u from '../../lib/util'
import Modal from 'antd/lib/modal/Modal'
import sumBy from 'lodash/sumBy'
import get from 'lodash/get';

const TARGET_SUBSCRIPTION = gql `
subscription branch_employee_weekly_target($branch_id: Int, $year: Int, $week: Int) {
  branch_employee_weekly_target(where: {year: {_eq: $year}, week: {_eq: $week}, branch_id: {_eq: $branch_id},deleted_at:{_is_null:true}}) {
    trip_target
    employee_id
    branch_id
    employee {
      id
      name
      mobileno
    }
  }
}`

const UPSERT_TARGET_DATA = gql`
mutation insert_employee_target($trip_target: Int!, $employee_id: Int!, $week: Int!, $year: Int!, $branch_id: Int!) {
  insert_branch_employee_weekly_target(objects: [{trip_target: $trip_target, employee_id: $employee_id, week: $week, year: $year, branch_id: $branch_id}], on_conflict: {constraint: branchid_year_week_employee, update_columns: [trip_target], where: {employee_id: {_eq: $employee_id}, branch_id: {_eq: $branch_id}, week: {_eq: $week}, year: {_eq: $year}}}) {
    returning {
      id
      employee_id
      trip_target
    }
  }
}`

const WeeklyTarget = (props) => {
  const { visible, onHide, data, year, week } = props
  const { role } = u
  const weekly_target = [role.admin, role.hr]
  const {data:target_data,loading,error} = useSubscription(
    TARGET_SUBSCRIPTION,{
      variables:{
        branch_id: data.id,
        week: week,
        year: year, 
      }
    }
  )
  const [employee_target] = useMutation(
    UPSERT_TARGET_DATA,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Saved!!') }
    }
  )

  const onSubmit = (value, employee_id) => {
    employee_target({
      variables: {
        branch_id: data.id,
        week: week,
        year: year,
        employee_id: employee_id,
        trip_target: parseInt(value, 10)
      }
    })
  }
  const target_array = get(target_data,'branch_employee_weekly_target',[])
  const total = sumBy(target_array, 'trip_target')

  const TableItem = [
    {
      title: 'BM.Traffic',
      width: '38%',
      render: (text, record) => {
        return (
          get(record, 'employee.name', null)
        )
      }
    },
    {
      title: 'Phone',
      render: (text, record) => get(record, 'employee.mobileno', null),
      width: '32%',
    },
    {
      title: 'Employee Target',
      width: '30%',
      render: (text, record) => {
        return (
          <EditableCell
            label={get(record, 'trip_target', 0)}
            onSubmit={(value) => onSubmit(value, record.employee.id)}
            edit_access={weekly_target}
          />
        )
      }
    }
  ]
  return (
    <Modal
      visible={visible}
      title={`Weekly Target - ${total}`}
      onCancel={onHide}
      style={{ top: 2 }}
      width={700}
      footer={[]}
    >
      <Table
        columns={TableItem}
        dataSource={target_array}
        size='small'
        pagination={false}
        scroll={{ x: 420 }}
        rowKey={(record) => record.employee.id}
      />
    </Modal>

  )
}

export default WeeklyTarget
