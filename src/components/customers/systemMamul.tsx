import React from 'react'
import { Modal, Table, Button ,Space,message} from 'antd'
import { gql, useSubscription ,useMutation} from '@apollo/client'
import get from 'lodash/get'
import EditableCell from '../common/editableCell';

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

const UPDATE_STANDARD_MAMUL = gql `mutation updateStandardMamul($cardcode: String!, $standard_mamul: Int!) {
  update_customer(where: {cardcode: {_eq: $cardcode}}, _set: {standard_mamul: $standard_mamul}) {
    affected_rows
  }
}
`
const SystemMamul = (props) => {
  const { visible, onHide, cardcode, edit_access,standard_mamul,system_mamul } = props
  const { loading, error, data } = useSubscription(
    SYSTEM_MAMUL, { variables: { cardcode } }
  )

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

  const [updateStandardMamul] = useMutation(
    UPDATE_STANDARD_MAMUL,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted () {
        message.success('Updated!!')
        onHide()
      }

    }
  )

  const updateMamul =  (value) => {
    if(system_mamul < value ) {
      updateStandardMamul({
        variables:{
          cardcode: cardcode,
          standard_mamul:value
        }
      })
    }
    else {
      message.error('Standard mamul cannot be less than System mamul')
    }
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
        title={
          <Space>
            <span style={{fontSize:14}}>{`System Mamul ${system_mamul}`}</span>
            <span style={{fontSize:14}}>Standard Mamul</span>
            <span className='text'>
            <EditableCell
              label={standard_mamul}
              onSubmit={(value)=>updateMamul(value)}
              edit_access={edit_access}
            /></span>
          </Space>}
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
