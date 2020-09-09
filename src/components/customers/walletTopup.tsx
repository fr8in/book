import { Modal, Row, Col, Button, message, Input, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import sumBy from 'lodash/sumBy'
import get from 'lodash/get'

const CUSTOMER_INCOMING_PAYMENTS = gql`
query  bank_incoming($search:String){
  bank_incoming(search:$search) {
    transno
    amount
    date
    details
    originno
  }
}`

const CUSTOMER_TOPUP_MUTATION = gql`
mutation customer_topup(
  $transno: Int!
  $originno: Int!
  $created_by: String!
  $walletcode: String!
) {
  customer_topup(
    transno: $transno
    originno: $originno
    created_by: $created_by
    walletcode: $walletcode
  ) {
    status
    description
  }
}`

const WalletTopup = (props) => {
  const { visible, onHide, walletcode } = props
  const [search, setSearch] = useState(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRow, setSelectedRow] = useState([])
  const [disableButton, setDisableButton] = useState(true)

  const { loading, data, error } = useQuery(
    CUSTOMER_INCOMING_PAYMENTS,
    {
      variables: { search: search || null }
    }
  )
  const [customer_topup] = useMutation(
    CUSTOMER_TOPUP_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const status = get(data, 'customer_topup.status', null)
        const description = get(data, 'customer_topup.description', null)
        if (status === 'OK') {
          message.success(description || 'Processed!')
          onHide()
        } else (message.error(description))
      }
    }
  )

  console.log('WalletTopup Error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const bank_incoming = get(_data, 'bank_incoming', [])
  const count = bank_incoming ? bank_incoming.length : 0
  const total = bank_incoming ? sumBy(bank_incoming, 'amount').toFixed(2) : 0

  const onSubmit = () => {
    customer_topup({
      variables: {
        transno: selectedRow[0].transno,
        originno: selectedRow[0].originno,
        created_by: 'karthik.fr8.in',
        walletcode: walletcode
      }
    })
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
  }

  const selectOnchange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRow(selectedRows)
    setDisableButton(!!(selectedRows && selectedRows.length === 0))
  }

  const columns = [
    {
      title: 'Reference No',
      dataIndex: 'transno',
      sorter: (a, b) => (a.transno > b.transno ? 1 : -1),
      width: '15%'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => (a.date > b.date ? 1 : -1),
      width: '12%'
    },
    {
      title: 'Payment Details',
      dataIndex: 'details',
      width: '57%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => (a.amount > b.amount ? 1 : -1),
      width: '16%'
    }
  ]

  const footerData = (
    <Row>
      <Col flex='auto' className='text-left'>
        <span>Total Amount: <b>₹{total}</b></span>
      </Col>
      <Col flex='120px'>
        <Button type='primary' disabled={disableButton} onClick={onSubmit}>Top Up</Button>
      </Col>
    </Row>)

  return (
    <Modal
      title={
        <div>
          <Row>
            <Col className='mb5'>Top Up to Wallet - {count}</Col>
          </Row>
          <Row><Input placeholder='Search...' suffix={<SearchOutlined />} onChange={onSearch} /></Row>
        </div>
      }
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      width={900}
      bodyStyle={{ padding: 10 }}
      style={{ top: 20 }}
      footer={footerData}
    >
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: selectOnchange,
          type: 'radio'
        }}
        columns={columns}
        dataSource={bank_incoming}
        rowKey={(record) => record.transno}
        size='small'
        pagination={false}
        loading={loading}
        scroll={{ x: 800, y: 400 }}
      />
    </Modal>
  )
}

export default WalletTopup
