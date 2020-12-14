import { useContext } from 'react'
import { Table, Button, Space } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import IncentiveApprove from '../partners/approvals/incentiveApprove'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import { gql, useSubscription } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'

const SCRATCH_CARD_INCENTIVE_TABLE_SUBSCRIPTION = gql`
subscription incentives($id: Int) {
  trip(where: {id: {_eq: $id}}) {
    id
    incentives(where:{incentive_config:{auto_creation:{_eq:false}}}) {
      id
      amount
      comment
      incentive_status {
        status
      }
      incentive_config {
        type
      }
    }
  }
}
`

const ScratchCardIncentiveTable = (props) => {
  const { trip_id,setIncentiveRefetch } = props
  const { role } = u
  const context = useContext(userContext)
  const incentive_approval_access = [role.admin]
  const incentive_access = u.is_roles(incentive_approval_access, context)

  const initial = {
    approveData: [],
    approveVisible: false
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)


  const { loading, error, data } = useSubscription(
    SCRATCH_CARD_INCENTIVE_TABLE_SUBSCRIPTION,
    {
      variables: {
        id: trip_id
      }
    }
  )
  console.log('CreditNoteTable error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const scratch_card_incentive = get(_data, 'trip[0].incentives', [])

  const columns = [
    {
      title: 'Type',
      width: '17%',
      render: (text, record) => {
        return (
          get(record, 'incentive_config.type', null)
        )
      }
    },
    {
      title: 'Amount ₹',
      dataIndex: 'amount',
      width: '16%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      width: '27%'
    },
    {
      title: 'Status',
      width: '14%',
      render: (text, record) => {
        return (
          get(record, 'incentive_status.status', null)
        )
      }
    },
    {
      title: 'Action',
      width: '12%',
      render: (text, record) => (
        get(record, 'incentive_status.status', null) === 'PENDING' && incentive_access ? (
        <Space>
          <Button
            type='primary'
            size='small'
            shape='circle'
            className='btn-success'
            icon={<CheckOutlined />}
            onClick={() => handleShow('approveVisible', 'Approve', 'approveData', record)}
          />
          <Button
            type='primary'
            size='small'
            shape='circle'
            danger
            icon={<CloseOutlined />}
            onClick={() => handleShow('approveVisible', 'Reject', 'approveData', record)}
          />
        </Space>)
            : <div />)
    }
  ]
  return (
    <div className='cardFix'>
      <Table
        dataSource={scratch_card_incentive}
        columns={columns}
        pagination={false}
        size='small'
        scroll={{ x: 650, y: 240 }}
        rowKey={record => record.id}
      />

      {object.approveVisible && (
        <IncentiveApprove
          visible={object.approveVisible}
          onHide={handleHide}
          item_id={object.approveData}
          title={object.title}
          trip_id={trip_id}
          setIncentiveRefetch={setIncentiveRefetch}
        />
      )}
    </div>
  )
}

export default ScratchCardIncentiveTable
