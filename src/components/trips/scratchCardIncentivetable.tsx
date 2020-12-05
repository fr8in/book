import { useContext } from 'react'
import { Table, Tooltip, Button, Space } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import moment from 'moment'
import get from 'lodash/get'
import Approve from '../partners/approvals/accept'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import { gql, useSubscription } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'



const ScratchCardIncentiveTable = (props) => {
 

  const initial = {
    approveData: [],
    approveVisible: false
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  

  const columns = [
    {
      title: 'Issue Type',
      width:  '17%' 
    },
    {
      title: 'Claim ₹',
      dataIndex: 'amount',
      width:  '11%' 
    },
    {
      title: 'Approved ₹',
      dataIndex: 'approved_amount',
      width: '16%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      width: '27%' 
    }, 
    {
      title: 'Status',
      width:  '14%',
    },
  
       {
        title: 'Action',
        width: '12%',
        render: (text, record) => (
            <Space>
              <Button
                type='primary'
                size='small'
                shape='circle'
                className='btn-success'
                //disabled={!(invoiced && !received && !closed) || lock}
                icon={<CheckOutlined />}
                onClick={() => handleShow('approveVisible', 'Approved', 'approveData', record)}
              />
              <Button
                type='primary'
                size='small'
                shape='circle'
                danger
                icon={<CloseOutlined />}
                onClick={() => handleShow('approveVisible', 'Rejected', 'approveData', record.id)}
              />
            </Space>)
      }
  ]
  return (
    <div className='cardFix'>
      <Table
        //dataSource={credit_debit_list}
        columns={columns}
        pagination={false}
        size='small'
        scroll={{ x: 650, y: 240 }}
        rowKey={record => record.id}
      />

      {object.approveVisible && (
        <Approve
          visible={object.approveVisible}
          onHide={handleHide}
          item_id={object.approveData}
          title={object.title}
          //setCreditNoteRefetch={setCreditNoteRefetch}
        />
      )}
    </div>
  )
}

export default ScratchCardIncentiveTable
