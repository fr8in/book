
import { Table, message, Row, Col, Button } from 'antd'
import React, { useState, useEffect } from 'react'
import get from 'lodash/get'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import Process from './process'
import now from 'lodash/now'
import useShowHide from '../../../../hooks/useShowHide'

const reliance_cashback = gql`
query reliance_cashback${now()}($year: Int!, $month: Int!) {
    reliance_cashback(year: $year, month: $month) {
      partner_id
      walletcode
      status
      consumption
      percentage
      amount
      status
      cardcode
      balance
    }
  }
  `

const RelianceCashBack = (props) => {
  const { month, year } = props
  
  const [relianceCashbackDetails, setRelianceCashbackDetails] = useState([])
  const initial = { processVisible: false }

  const { visible, onShow, onHide } = useShowHide(initial)

  const { loading, data } = useQuery(
    reliance_cashback, {
      variables: { year, month },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      skip: !month,
      onError (error) {
        message.error(error.message.toString())
      }
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
 
  useEffect(() => {
    const reliance_cashback = get(_data, 'reliance_cashback', [])
    setRelianceCashbackDetails(reliance_cashback)
  }, [loading])

  const columns = [
    {
      title: 'Partner Code',
      dataIndex: 'cardcode',
      render: (text, record) => {
        return (
          <Link href='/partners/[id]' as={`/partners/${text}`}>
            {text}
          </Link>
        )
      }
    },
    {
      title: 'Consumption',
      dataIndex: 'consumption',
      render: (text, record) => text.toFixed(2)
    },
    {
      title: 'CashBack',
      dataIndex: 'amount'
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      render: (text, record) => text.toFixed(2)
    }
  ]
  const title = `Reliance Cashback ${year}-${month}`
  return (
    <div>
      <Table
        rowClassName={(record, index) => record.balance > 0 ? 'cashbackRow' : 'cashbackRowNegativeWallet'}
        columns={columns}
        dataSource={relianceCashbackDetails}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
        rowKey={(record) => record.cardcode}
        loading={loading}
      />
      {relianceCashbackDetails.length > 0 &&
        <Row>
          <Col xs={24} className='text-right p10'>
            <Button
              type='primary'
              onClick={() => onShow('processVisible')}
            >Next
            </Button>
          </Col>
        </Row>}

      {visible.processVisible && (
        <Process
          visible={visible.processVisible}
          onHide={onHide}
          title={title}
          month={month}
          year={year}
          setRelianceCashbackDetails={setRelianceCashbackDetails}
        />
      )}
    </div>
  )
}

export default RelianceCashBack
