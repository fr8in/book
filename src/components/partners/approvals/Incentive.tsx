import { Table, Input, Tooltip, Button, Space } from 'antd'
import {
  SearchOutlined,
  CommentOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { useState, useEffect, useContext } from 'react'
import Truncate from '../../common/truncate'
import Link from 'next/link'
import useShowHideWithRecord from '../../../hooks/useShowHideWithRecord'
import Comment from '../../trips/tripFeedBack'
import Approve from './accept'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import moment from 'moment'
import PartnerOnBoardedBy from '../partnerOnboardedByName'
import LinkComp from '../../common/link'
import u from '../../../lib/util'

import userContext from '../../../lib/userContaxt'
import isEmpty from 'lodash/isEmpty'


const Incentive = () => {
  
  
    const initial = {
        commentData: [],
        commentVisible: false,
        approveData: [],
        approveVisible: false,
        title: null,
        responsibity: null,
        searchText: null,
        pending: []
      }
    
    const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const ApprovalPending = [
    {
      title: '#',
      dataIndex: 'trip_id',
      key: 'trip_id',
      width: '6%',
      render: (text, record) =>
        <Link href='/trips/[id]' as={`/trips/${record.trip_id} `}>
          <a>{text}</a>
        </Link>
    },
   
    {
      title: 'Incentive Type',
      dataIndex: 'issueType',
      key: 'issueType',
      width: '8%',
      render: (text, record) => <Truncate data={get(record, 'credit_debit_type.name', null)} length={10} />
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '6%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      key: 'comment',
      width: '11%',
      render: (text, record) => <Truncate data={text} length={13} />
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
      width: '11%',
      render: (text, record) => <Truncate data={text} length={15} />
    },
    {
      title: 'Partner Name',
      dataIndex: 'partner',
      key: 'partner',
      width: '12%',
      render: (text, record) => {
        return (
          <LinkComp
            type='partners'
            data={get(record, 'trip.partner.cardcode', null) + '-' + get(record, 'trip.partner.name', null)}
            id={get(record, 'trip.partner.cardcode', null)}
            length={14}
          />
        )
      }
    },
    {
      title: 'Req.On',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      width: '7%',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    },
   
    {
      title: 'Comment',
      dataIndex: 'last_comment',
      key: 'last_comment',
      width: '11%',
      render: (text, record) => <Truncate data={get(record, 'trip.last_comment.description', null)} length={15} />
    },
    {
      title: 'Action',
      width: '8%',
      render: (text, record) => (
        <Space>
          <Tooltip title='Comment'>
            <Button
              type='link'
              icon={<CommentOutlined />}
              onClick={() => handleShow('commentVisible', null, 'commentData', record.trip_id)}
            />
          </Tooltip>
          <Tooltip title='Accept'>
    
              <Button
                type='primary'
                shape='circle'
                size='small'
                className='btn-success'
                icon={<CheckOutlined />}
                onClick={() =>
                  handleShow('approveVisible', 'Approved', 'approveData', record)}
              />)
          </Tooltip>
          <Tooltip title='Decline'>
         (
              <Button
                type='primary'
                shape='circle'
                size='small'
                danger
                icon={<CloseOutlined />}
                onClick={() =>
                  handleShow('approveVisible', 'Rejected', 'approveData', record.id)}
              />) 
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <>
      <Table
        columns={ApprovalPending}
        //dataSource={filter.pending}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1256 }}
        pagination={false}
        className='withAction'
        //loading={loading}
      />
      {object.commentVisible && (
        <Comment
          visible={object.commentVisible}
          tripid={object.commentData}
          onHide={handleHide}
        />
      )}
      {object.approveVisible && (
        <Approve
          visible={object.approveVisible}
          onHide={handleHide}
          item_id={object.approveData}
          title={object.title}
        />
      )}
    </>
  )
}

export default Incentive
