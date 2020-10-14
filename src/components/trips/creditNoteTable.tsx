import { Table, Tooltip, Button, Space } from 'antd'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import moment from 'moment'
import get from 'lodash/get'
import Approve from '../partners/approvals/accept'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import { gql, useSubscription} from '@apollo/client'

const CREDIT_NOTE_TABLE_SUBSCRIPTION = gql`
subscription credit_debits($id:Int){
  trip(where: {id: {_eq: $id}}) {
    credit_debits {
      id
      type
      credit_debit_type {
        name
      }
      amount
      approved_amount
      comment
      credit_debit_status {
        name
      }
    }
  }
}
`

const CreditNoteTable = (props) => {
  const { trip_id } = props
  console.log('trip_id',trip_id)
  const authorised = true
  const initial = {
    approveData: [],
    approveVisible: false,
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const { loading, error, data } = useSubscription(
    CREDIT_NOTE_TABLE_SUBSCRIPTION,
    {
      variables: {
       id : trip_id
      },
    }
  )
  console.log('CreditNoteTable error', error)
  console.log('CreditNoteTable data', data)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const credit_debit_list = get(_data, 'trip[0].credit_debits', null)
console.log('credit_debit_list',credit_debit_list)
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      width: authorised ? '10%' : '14%'
    },
    {
      title: 'Issue Type',
     // dataIndex: 'issueType',
      width: authorised ? '17%' : '19%',
      render: (text, record) => {
       return  get(record, 'credit_debit_type.name', null)
      } 
    },
    {
      title: 'Claim ₹',
      dataIndex: 'amount',
      width: authorised ? '11%' : '12%'
    },
    {
      title: 'Approved ₹',
      dataIndex: 'approved_amount',
      width: '14%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      width: authorised ? '24%' : '27%',
      render: (text, record) => {
        return (
          <Tooltip
            title={'' + 'createdOn:\t' + record.createdOn && moment(record.createdOn).format('DD MMM YYYY hh:mm a') +
                          '\ncreatedBy:\t' + record.createdBy}
          ><span>{record.comment}</span>
          </Tooltip>)
      }
    }, {
      title: 'Status',
      //dataIndex: 'approvalStatus',
      width: authorised ? '12%' : '14%',
      render: (text, record) => {
        if ((record.approvedBy)) {
          return (
            <Tooltip
              title={'' + 'approvedOn:\t' + record.approvedOn && moment(record.approvedOn).format('DD MMM YYYY hh:mm a') + '\napprovedBy:\t' + record.approvedBy + '\n' + record.approvalComment}
            >
              {get(record, 'credit_debit_status.name', null)}
            </Tooltip>)
        }
        return get(record, 'credit_debit_status.name', null)
      }
    },
    authorised
      ? {
        title: 'Action',
        width: '12%',
        render: (text, record) => (
          get(record, 'credit_debit_status.name', null) === 'PENDING'
            ? <Space>
              <Button type='primary' className='btn-success' icon={<CheckCircleFilled />}  onClick={() =>
                handleShow('approveVisible', 'Approved', 'approveData', record)}/>
              <Button type='primary' danger icon={<CloseCircleFilled />}  onClick={() =>
                handleShow('approveVisible', 'Rejected', 'approveData', record.id)}/>
            </Space>
            : <div />)
      } : {}
  ]
  return (
    <div className='cardFix'>
      <Table
        dataSource={credit_debit_list}
        columns={columns}
        pagination={false}
        size='small'
        scroll={{ x: authorised ? 780 : 650, y: 240 }}
      />
      {/* <ApprovalModal tripId={this.props.tripId} /> */}
      {object.approveVisible && (
        <Approve
          visible={object.approveVisible}
          onHide={handleHide}
          item_id={object.approveData}
          title={object.title}
        />
      )}
    </div>
  )
}

export default CreditNoteTable
