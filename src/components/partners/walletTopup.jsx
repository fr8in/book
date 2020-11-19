import { useState, useEffect, useContext } from 'react'
import { Modal, Table, Row, Button, Col, message, Space, Checkbox } from 'antd'
import _ from 'lodash'
import { gql, useQuery, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import moment from 'moment'

const PARTNER_MANUAL_TOPUP = gql`
query partner_invoiced($id: Int!){
  partner(where:{id:{_eq:$id}}) {
    id
    invoiced {
      trip_id
      date
      due_date
      amount
      balance
      docnum
      docentry
    }
  }
}`

const MANUAL_TOPUP_MUTATION = gql`
mutation partner_manual_topup($created_by: String!, $topups: [PartnerTopUp] ) {
  partner_manual_topup(created_by: $created_by, topups: $topups) {
    description
    status
  }
}`

const walletTopup = (props) => {
  const { visible, onHide, partner_id } = props

  const [invocedTrips, setInvoicedTrips] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedTopUps, setSelectedTopUps] = useState(true)
  const [disbleBtn, setDisbleBtn] = useState(false)
  const [total, setTotal] = useState(0)
  const context = useContext(userContext)

  const { loading, data, error, refetch } = useQuery(
    PARTNER_MANUAL_TOPUP,
    {
      variables: { id: partner_id },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  const [partner_manual_topup] = useMutation(
    MANUAL_TOPUP_MUTATION,
    {
      onError(error) {
        message.error(error.toString())
        setDisbleBtn(false)
      },
      onCompleted(data) {
        const status = _.get(data, 'partner_manual_topup.status', null)
        const description = _.get(data, 'partner_manual_topup.description', null)
        if (status === 'OK') {
          setDisbleBtn(false)
          message.success(description || 'Processed!')
          refetch()
          onHide()
        } else {
          setDisbleBtn(false)
          message.error(description)
        }
      }
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }

  const invoiced = _.get(_data, 'partner[0].invoiced', [])

  useEffect(() => {
    const all = invoiced.map(data => {
      return {
        ...data
      }
    })
    setInvoicedTrips(all)
  }, [loading])

  const onSubmit = () => {
    setDisbleBtn(true)
    partner_manual_topup({
      variables: {
        created_by: context.email,
        topups: selectedRowKeys.map(docnum => {
          return {
            docnum: docnum.toString(),
            is_with_deduction: !!selectedTopUps
          }
        })
      }
    })
  }

  const selectOnchange = (keys, rows) => {
    if (selectedRowKeys.length > 10) {
      message.error('Please Select maximum 10 trips')
    } else {
      setSelectedRowKeys(keys)
      setTotal(_.sumBy(rows, 'balance'))
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: selectOnchange
  }

  const onChange = (e) => {
    setSelectedTopUps(e.target.checked)
  }

  const discount = selectedTopUps ? total * 2 / 100 : 0
  const net_topup = total - discount

  const walletColumns = [
    {
      title: 'Trip Id',
      dataIndex: 'trip_id',
      key: 'loadid',
      width: '15%',
      sorter: (a, b) => (a.id > b.id ? 1 : -1),
    },
    {
      title: 'AP Date',
      dataIndex: 'date',
      key: 'date',
      width: '14%',
      render: (text, record) => {
        const date = parseInt(record.date, 10)
        return (
          date ? moment(date).format('DD MMM YY') : '-'
        )
      },
      sorter: (a, b) => (a.date > b.date ? 1 : -1)
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'docDueDate',
      width: '14%',
      render: (text, record) => {
        const date = parseInt(record.due_date, 10)
        return (
          moment(date).format('DD MMM YY')
        )
      },
      sorter: (a, b) => (a.date > b.date ? 1 : -1)
    },
    {
      title: 'Price',
      dataIndex: 'amount',
      key: 'amount',
      width: '15%',
      sorter: (a, b) => (a.amount > b.amount ? 1 : -1),
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      width: '12%',
      render: (text, record) => text,
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1)
    }
  ]

  return (
    <Modal
      title='Wallet Top Up'
      visible={visible}
      onCancel={onHide}
      width={900}
      bodyStyle={{ padding: 20 }}
      style={{ top: 20 }}
      footer={
        <Row justify='start' className='m5'>
          <Space>
            <Col>
              <Checkbox defaultChecked={selectedTopUps} onChange={onChange}>2% Discount</Checkbox>
              <b> {discount} </b>
            </Col>
          </Space>
          <Col flex='180'>
            <Space>
              <b> Amount : {net_topup} </b>
              <Button onClick={onHide}>Cancel</Button>
              <Button type='primary' onClick={onSubmit} loading={disbleBtn}>Top Up</Button>
            </Space>
          </Col>
        </Row>
      }
    >
      <Table
        rowSelection={rowSelection}
        columns={walletColumns}
        dataSource={invocedTrips}
        rowKey={record => record.docnum}
        size='small'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
        loading={loading}
      />
    </Modal>
  )
}

export default walletTopup
