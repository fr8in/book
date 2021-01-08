import { Modal, Row, Col, Button, message, Input, Table, Checkbox } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useState, useContext } from 'react'
import sumBy from 'lodash/sumBy'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import moment from 'moment'

const CUSTOMER_INCOMING_PAYMENTS = gql`
query  bank_incoming($search:String,$bank:[String]){
  bank_incoming(search:$search,bank:$bank) {
    transno
    amount
    date
    details
    originno
    bank
  }
}`

const CUSTOMER_TOPUP_MUTATION = gql`
mutation customer_topup(
  $transno: Int!
  $originno: String!
  $created_by: String!
  $customer_id: Int!
) {
  customer_topup(
    transno: $transno
    originno: $originno
    created_by: $created_by
    customer_id: $customer_id
  ) {
    status
    description
  }
}`

const WalletTopup = (props) => {
  const { visible, onHide, customer_id, customer_incoming_refetch } = props
  const [search, setSearch] = useState(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRow, setSelectedRow] = useState([])
  const [disableButton, setDisableButton] = useState(true)
  const context = useContext(userContext)
  const [bankFilter, setBankFilter] = useState([])

  const { loading, data, error, refetch } = useQuery(
    CUSTOMER_INCOMING_PAYMENTS,
    {
      variables: { search: search || null, bank: bankFilter },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  const [customer_topup] = useMutation(
    CUSTOMER_TOPUP_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted(data) {
        const status = get(data, 'customer_topup.status', null)
        const description = get(data, 'customer_topup.description', null)
        if (status === 'OK') {
          message.success(description || 'Processed!')
          refetch()
          onHide()
          if (customer_incoming_refetch) {
            customer_incoming_refetch()
          }
        } else (message.error(description))
      }
    }
  )

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
        originno: selectedRow[0].originno.toString(),
        created_by: context.email,
        customer_id: customer_id
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
      width: '16%'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => (a.date > b.date ? 1 : -1),
      width: '12%',
      render: (text, record) => text ? moment(parseInt(text)).format('DD-MMM-YY') : '-'
    },
    {
      title: 'Payment Details',
      dataIndex: 'details',
      width: '50%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => (a.amount > b.amount ? 1 : -1),
      width: '14%'
    },
    {
      title: 'Bank',
      dataIndex: 'bank',
      key: 'bank',
      width: '8%',
      filterDropdown: (
        <Checkbox.Group
          options={['ICICI', 'HDFC']}
          onChange={(checked) => setBankFilter(checked)}
          className='filter-drop-down'
        />
      )
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
