import { Table, Tooltip, Button, Space, Pagination } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import Link from 'next/link'
import { useContext } from 'react'
import u from '../../../lib/util'
import userContext from '../../../lib/userContaxt'
import Truncate from '../../common/truncate'
import useShowHideWithRecord from '../../../hooks/useShowHideWithRecord'
import moment from 'moment'
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import AdditionalAdvanceBankAccept from './additionalAdvanceBankAccept'
import PayablesStatus from '../payables/payablesStatus'

const ADDITIONAL_ADVANCE_BANK_APPROVAL = gql`subscription additional_advance($status: String, $offset: Int, $limit: Int) {
  advance_additional_advance(where: {status: {_eq: $status}, payment_mode: {_eq: "BANK"}}, order_by: {id: desc}, offset: $offset, limit: $limit) {
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

const AdditionalAdvanceBankApproval = () => {
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

  const { loading, data } = useSubscription(
    ADDITIONAL_ADVANCE_BANK_APPROVAL)

  let _data = {}
  if (!loading) {
    _data = data
  }


  const additionalAdvance = get(_data, 'advance_additional_advance', [])
  const statusHandle = (record) => {
    handleShow('statusVisible', null, 'doc_num', parseFloat(record.docentry))
  }
  const columns = [
    {
      title: 'Trip Id',
      dataIndex: 'trip_id',
      key: 'trip_id',
      width: '6%',
      render: (text, record) =>
        <Link href='/trips/[id]' as={`/trips/${record.trip_id} `}>
          <a>{text}</a>
        </Link>
    },
    {
      title: 'Type',
      dataIndex: 'payment_mode',
      width: '10%',
      render: (text) => text || 'WALLET'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '10%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      width: '15%',
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
      width: '20%',
      render: (text, record) => <Truncate data={text} length={15} />
    },
    {
      title: 'Created On',
      dataIndex: 'created_at',
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      width: '15%',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    },
    {
      title: 'Action',
      width: '12%',
      render: (text, record) => (
        <Space>
          <Tooltip title='Approve'>
            {approval_access
              ? (
                <Button
                  type='primary'
                  shape='circle'
                  size='small'
                  className='btn-success'
                  icon={<CheckOutlined />}
                  onClick={() =>
                    handleShow('approveVisible', 'Approve', 'approveData', record)}
                />)
              : null}
          </Tooltip>
          <Tooltip title='Reject'>
            {rejected_access
              ? (
                <Button
                  type='primary'
                  shape='circle'
                  size='small'
                  danger
                  icon={<CloseOutlined />}
                  onClick={() =>
                    handleShow('approveVisible', 'Reject', 'approveData', record)}
                />)
              : null}
          </Tooltip>
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
      <Table
        columns={columns}
        dataSource={additionalAdvance}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 660 }}
        pagination={false}
      />
      {!loading && record_count
        ? (
          <Pagination
            size='small'
            // current={currentPage}
            // pageSize={filter.limit}
            // showSizeChanger={false}
            // total={record_count}
            // onChange={pageChange}
            className='text-right p10'
          />) : null}
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
    </>
  )
}

export default AdditionalAdvanceBankApproval
