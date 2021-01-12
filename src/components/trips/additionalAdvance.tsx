import { useEffect } from 'react'
import { Table, Tooltip, Button, Space } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import { useContext } from 'react'
import moment from 'moment'
import Truncate from '../common/truncate'
import u from '../../lib/util'
import userContext from '../../lib/userContaxt'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import AdditionalAdvanceBankAccept from '../partners/approvals/additionalAdvanceBankAccept'
import PayablesStatus from '../partners/payables/payablesStatus'
import isEmpty from 'lodash/isEmpty'

const ADDITIONAL_ADVANCE_QUERY = gql`subscription additional_advance($trip_id: Int_comparison_exp!) {
  advance_additional_advance(where: {trip_id: $trip_id}order_by:{id:desc}) {
    id
    trip_id
    account_name
    account_number
    ifsc_code
    docentry
    amount
    comment
    created_at
    created_by
    payment_mode
    status
  }
}`

const EXCESS_ADVANCE_QUERY = gql`subscription excess_advance($trip_id: Int_comparison_exp!) {
  advance_excess_advance(where: {status: {_eq: "COMPLETED"}, trip_id: $trip_id}) {
    id
    trip_id
    amount:eligible_advance
    comment
    created_at
    created_by
    status
  }
}
`

const AdditionalAdvance = (props) => {
  const { loaded, ad_trip_id, advanceRefetch, setAdvanceRefetch } = props
  const { loading, error, data } = useSubscription(
    ADDITIONAL_ADVANCE_QUERY, {
    variables: { trip_id: { _eq: ad_trip_id } }
  })
  const { role } = u
  const context = useContext(userContext)
  const approve_roles = [role.admin, role.rm]
  const approval_access = u.is_roles(approve_roles, context)
  const reject_roles = [role.admin, role.rm]
  const rejected_access = u.is_roles(reject_roles, context)
  const initial = {
    approveData: [],
    doc_num: null,
    statusVisible: false,
    approveVisible: false,
    title: null
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const { loading: excessLoading, error: excessError, data: excessData } = useSubscription(
    EXCESS_ADVANCE_QUERY, {
    variables: { trip_id: { _eq: ad_trip_id } }
  })

  console.log('Additional advance error', error, data, excessLoading,excessError, excessData)
  const statusHandle = (record) => {
    handleShow('statusVisible', null, 'doc_num', parseFloat(record.docentry))
  }
  var _data = {}
  if (!loading) {
    _data = data
  }
  let _excessData = {}
  if (!excessLoading) {
    _excessData = excessData
  }
  useEffect(() => {
    if (advanceRefetch) {
      setAdvanceRefetch(false)
    }
  }, [advanceRefetch])

  const additionalAdvance = get(_data, 'advance_additional_advance', [])
  const excessAdvance = get(_excessData, 'advance_excess_advance', [])
  const list = [...additionalAdvance, ...excessAdvance]
  
  const columns = [
    {
      title: 'Type',
      dataIndex: 'payment_mode',
      width: '8%',
      render:(text)=>text ? text : "WALLET"
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '10%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      width: '17%',
      render: (text, record) => <Truncate data={text} length={13} />
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '10%'
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      width: '15%',
      render: (text, record) => <Truncate data={text} length={15} />
    },
    {
      title: 'Created On',
      dataIndex: 'created_at',
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      width: '18%',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    },
    {
      title: 'Action',
      width: '20%',
      render: (text, record) => (
        <Space className='actions'>
          {approval_access && record.status === "PENDING" && record.payment_mode === "BANK"
              ? (
          <Tooltip title='Approve'>
                <Button
                  type='primary'
                  shape='circle'
                  size='small'
                  className='btn-success'
                  icon={<CheckOutlined />}
                  onClick={() =>
                    handleShow('approveVisible', 'Approve', 'approveData', record)}
                />
          </Tooltip>
          )
          : null}
          {rejected_access && record.status === "PENDING" && record.payment_mode === "BANK"
              ? (
          <Tooltip title='Reject'>
                <Button
                  type='primary'
                  shape='circle'
                  size='small'
                  danger
                  icon={<CloseOutlined />}
                  onClick={() =>
                    handleShow('approveVisible', 'Reject', 'approveData', record)}
                />
          </Tooltip>
          )
              : null}
          {record.docentry &&
            <Tooltip title='Status'>
              <Button size='small' shape='circle' icon={<EyeOutlined />} type='primary' className='btn-success' onClick={() => statusHandle(record)} />
            </Tooltip>}
        </Space>
      )
    }
  ]
  return (
    <>
      {!isEmpty(additionalAdvance) || !isEmpty(excessAdvance)? (
        <>
        <Table
          columns={columns}
          dataSource={list}
          rowKey={record => record.id}
          size='small'
          scroll={{ x: 660 }}
          pagination={false}
        />
        {object.approveVisible && (
          <AdditionalAdvanceBankAccept
            visible={object.approveVisible}
            onHide={handleHide}
            item_id={object.approveData}
            title={object.title}
          />
        )}
        {object.statusVisible && (
          <PayablesStatus
            visible={object.statusVisible}
            onHide={handleHide}
            doc_num={object.doc_num}
          />
        )}
        </>)
        : !(loaded) 
          ?<div className='additonalAdv mb0'><p>Additional advance available after process advance</p></div>
          : <div className='additonalAdv mb0'><p>Additional advance not processed</p></div>}
    </>
  )
}

export default AdditionalAdvance
