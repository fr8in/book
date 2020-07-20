import { Table, Tooltip, Button, Space } from 'antd'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import moment from 'moment'

const CreditNoteTable = () => {
  const authorised = true

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      width: authorised ? '10%' : '14%'
    },
    {
      title: 'Issue Type',
      dataIndex: 'issueType',
      width: authorised ? '17%' : '19%'
    },
    {
      title: 'Claim ₹',
      dataIndex: 'amount',
      width: authorised ? '11%' : '12%'
    },
    {
      title: 'Approved ₹',
      dataIndex: 'approvedAmount',
      width: '14%'
    },
    {
      title: 'Reason',
      dataIndex: 'disputeReason',
      width: authorised ? '24%' : '27%',
      render: (text, record) => {
        return (
          <Tooltip
            title={'' + 'createdOn:\t' + record.createdOn && moment(record.createdOn).format('DD MMM YYYY hh:mm a') +
                          '\ncreatedBy:\t' + record.createdBy}
          ><span>{record.disputeReason}</span>
          </Tooltip>)
      }
    }, {
      title: 'Status',
      dataIndex: 'approvalStatus',
      width: authorised ? '12%' : '14%',
      render: (text, record) => {
        if ((record.approvedBy)) {
          return (
            <Tooltip
              title={'' + 'approvedOn:\t' + record.approvedOn && moment(record.approvedOn).format('DD MMM YYYY hh:mm a') + '\napprovedBy:\t' + record.approvedBy + '\n' + record.approvalComment}
            >
              {record.approvalStatus}
            </Tooltip>)
        }
        return record.approvalStatus
      }
    },
    authorised
      ? {
        title: 'Action',
        width: '12%',
        render: (text, record) => (
          record.approvalStatus === 'PENDING'
            ? <Space>
              <Button type='primary' className='btn-success' icon={<CheckCircleFilled />} />
              <Button type='primary' danger icon={<CloseCircleFilled />} />
            </Space>
            : <div />)
      } : {}
  ]
  return (
    <div className='cardFix'>
      <Table
        // dataSource={props.creditDebitList}
        columns={columns}
        pagination={false}
        size='small'
        scroll={{ x: authorised ? 780 : 650, y: 240 }}
      />
      {/* <ApprovalModal tripId={this.props.tripId} /> */}
    </div>
  )
}

export default CreditNoteTable
