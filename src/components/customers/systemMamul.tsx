import React from 'react'
import { Modal, Table, Button } from 'antd'
import { gql, useSubscription } from '@apollo/client'

const SYSTEM_MAMUL = gql`subscription customer_mamul_summary($cardcode: String!) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    cardcode
    customer_mamul_summary {
      id
      cardcode
      closed_orders
      billed_orders
      mamul_charge_sum
      writeoff_others_sum
      pending_balance_category1
      pending_balance_category2
      pending_balance_category3
      system_mamul
      system_mamul_avg
      track_mamul
      mamul_difference
    }
  }
}`

const SystemMamul = (props) => {
  const { visible, onHide, cardcode } = props

  const { loading, error, data } = useSubscription(
    SYSTEM_MAMUL, { variables: { cardcode } }
  )

  console.log('SystemMamul Error', error)
  const customer_mamul_summary = []
  let mamul_summary = []
  let billed_orders = 0
  if (!loading) {
    const customer = data && data.customer[0] ? data.customer[0] : null
    mamul_summary = customer && customer.customer_mamul_summary[0] ? customer.customer_mamul_summary[0] : []
    mamul_summary.row_name = 'Sum'
    const billedOrders = mamul_summary.billed_orders
    billed_orders = billedOrders === 0 ? 1 : billedOrders
    const mamul_summary_avg = {
      id: mamul_summary.id + 1,
      billed_orders: (mamul_summary.billed_orders) / billed_orders,
      mamul_charge_sum: (mamul_summary.mamul_charge_sum) / billed_orders,
      writeoff_others_sum: (mamul_summary.writeoff_others_sum) / billed_orders,
      pending_balance_category1: ((mamul_summary.pending_balance_category1) * 0.25) / billed_orders,
      pending_balance_category2: ((mamul_summary.pending_balance_category2) * 0.5) / billed_orders,
      pending_balance_category3: ((mamul_summary.pending_balance_category3) * 1) / billed_orders,
      system_mamul: mamul_summary.system_mamul_avg,
      row_name: 'Avg'
    }
    customer_mamul_summary.push(mamul_summary)
    customer_mamul_summary.push(mamul_summary_avg)
  }

  const columns = [
    {
      title: '',
      dataIndex: 'row_name',
      width: '5%',
      render: (text, record) => <span style={{ color: 'color: #cccccc' }}>{text}</span>
    },
    {
      title: 'Billed',
      dataIndex: 'billed_orders',
      width: '8%'
    },
    {
      title: 'Mamul',
      dataIndex: 'mamul_charge_sum',
      width: '9%',
      render: (text, record) => text ? text.toFixed(2) : 0
    },
    {
      title: 'WriteOff',
      dataIndex: 'writeoff_others_sum',
      width: '10%',
      render: (text, record) => text ? text.toFixed(2) : 0
    },
    {
      title: 'Balance[60-120]',
      dataIndex: 'pending_balance_category1',
      width: '15%',
      render: (text, record) => text ? text.toFixed(2) : 0
    },
    {
      title: 'Balance[120-180]',
      dataIndex: 'pending_balance_category2',
      width: '15%',
      render: (text, record) => text ? text.toFixed(2) : 0
    },
    {
      title: 'Balance[>180]',
      dataIndex: 'pending_balance_category3',
      width: '13%',
      render: (text, record) => text ? text.toFixed(2) : 0
    },
    {
      title: 'System Mamul',
      dataIndex: 'system_mamul',
      width: '12%',
      render: (text, record) => text ? text.toFixed(2) : 0
    }
  ]

  return (
    <>
      <Modal
        visible={visible}
        title='System Mamul'
        width='90%'
        onCancel={onHide}
        footer={[
          <Button onClick={onHide} key='back'>Close</Button>
        ]}
      >
        <Table
          columns={columns}
          dataSource={customer_mamul_summary}
          rowKey={record => record.id}
          scroll={{ x: 1000, y: 200 }}
          size='small'
          pagination={false}
          tableLayout='fixed'
          loading={loading}
        />
      </Modal>
    </>
  )
}

export default SystemMamul
