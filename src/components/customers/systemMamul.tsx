import React from 'react'
import { Modal, Table, Button } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'

const SYSTEM_MAMUL = gql`
subscription customer_mamul_summary($cardcode: String!) {
  accounting_customer_mamul(where: {cardcode: {_eq: $cardcode}}) {
    cardcode
    billed_order
    closed_order
    mamul_charge
    avg_system_mamul
    pending_balance_120_180
    pending_balance_180
    pending_balance_60_120
    write_off_charge
  }
}`

const SystemMamul = (props) => {
  const { visible, onHide, cardcode } = props

  const { loading, error, data } = useSubscription(
    SYSTEM_MAMUL, { variables: { cardcode } }
  )

  console.log('SystemMamul Error', error)
  const customer_mamul_summary = []
  if (!loading) {
    const mamul_summary = get(data, 'accounting_customer_mamul[0]', null)
    const billedOrders = get(mamul_summary, 'billed_order', 0)
    const billed_order = billedOrders === 0 ? 1 : billedOrders
    const mamul_summary_avg = {
      id: get(mamul_summary, 'id', 0) + 1,
      billed_order: 1,
      mamul_charge: get(mamul_summary, 'mamul_charge', 0) / billed_order,
      write_off_charge: get(mamul_summary, 'write_off_charge', 0) / billed_order,
      pending_balance_60_120: (get(mamul_summary, 'pending_balance_60_120', 0) * 0.25) / billed_order,
      pending_balance_120_180: (get(mamul_summary, 'pending_balance_120_180', 0) * 0.5) / billed_order,
      pending_balance_180: (get(mamul_summary, 'pending_balance_180', 0) * 1) / billed_order,
      system_mamul: get(mamul_summary, 'avg_system_mamul', 0),
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
      render: (text, record) => text || 'Sum'
    },
    {
      title: 'Billed',
      dataIndex: 'billed_order',
      width: '8%'
    },
    {
      title: 'Mamul',
      dataIndex: 'mamul_charge',
      width: '9%',
      render: (text, record) => text ? text.toFixed(2) : 0
    },
    {
      title: 'WriteOff',
      dataIndex: 'write_off_charge',
      width: '10%',
      render: (text, record) => text ? text.toFixed(2) : 0
    },
    {
      title: 'Balance[60-120]',
      dataIndex: 'pending_balance_60_120',
      width: '15%',
      render: (text, record) => text ? text.toFixed(2) : 0
    },
    {
      title: 'Balance[120-180]',
      dataIndex: 'pending_balance_120_180',
      width: '15%',
      render: (text, record) => text ? text.toFixed(2) : 0
    },
    {
      title: 'Balance[>180]',
      dataIndex: 'pending_balance_180',
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
          rowKey={record => get(record, 'id', null)}
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
