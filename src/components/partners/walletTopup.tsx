import { useState, useEffect } from 'react'
import { Modal, Table, Row, Button, Col, Radio, message } from 'antd'
import _ from 'lodash'
import { gql, useQuery, useMutation } from '@apollo/client'

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
  const [selectedTopUps, setSelectedTopUps] = useState([])
  const [total, setTotal] = useState(0)

  const { loading, data, error } = useQuery(
    PARTNER_MANUAL_TOPUP,
    {
      variables: { id: partner_id }
    }
  )

  const [partner_manual_topup] = useMutation(
    MANUAL_TOPUP_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        message.success(_.get(data, 'partner_manual_topup.description', 'Processed!'))
        onHide()
      }
    }
  )

  console.log('walletTopup Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const invoiced = _.get(_data, 'partner[0].invoiced', [])

  useEffect(() => {
    const all = invoiced.map(data => {
      return {
        ...data,
        is_with_deduction: '2%'
      }
    })
    setInvoicedTrips(all)
  }, [loading])

  const onSubmit = () => {
    partner_manual_topup({
      variables: {
        created_by: 'jay@fr8.in',
        topups: selectedTopUps.map(data => {
          return {
            docnum: data.docnum,
            is_with_deduction: data.is_with_deduction === '2%'
          }
        })
      }
    })
  }

  const handleRadioChange = (record, e) => {
    const selected = selectedTopUps.map(data => {
      return {
        ...data,
        is_with_deduction: data.docnum === record.docnum ? e.target.value : data.is_with_deduction
      }
    })
    setSelectedTopUps(selected)
    const all = invocedTrips.map(data => {
      return {
        ...data,
        is_with_deduction: data.docnum === record.docnum ? e.target.value : data.is_with_deduction
      }
    })
    setInvoicedTrips(all)
  }

  const selectOnchange = (keys, rows) => {
    if (selectedRowKeys.length > 10) {
      message.error('Please Select maximum 10 trips')
    } else {
      setSelectedRowKeys(keys)
      setSelectedTopUps(rows)
      setTotal(_.sumBy(rows, 'balance'))
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: selectOnchange
  }

  const walletColumns = [
    {
      title: 'Trip Id',
      dataIndex: 'trip_id',
      key: 'loadid',
      width: '15%'
    },
    {
      title: 'AP Date',
      dataIndex: 'date',
      key: 'date',
      width: '14%',
      render: (text, record) => text
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'docDueDate',
      width: '14%',
      render: (text, record) => text
    },
    {
      title: 'Price',
      dataIndex: 'amount',
      key: 'amount',
      width: '15%'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      width: '12%',
      render: (text, record) => text
    },
    {
      title: 'Top Up',
      width: '12%',
      render: (text, record) => record.balance
    },
    {
      title: 'Deduction',
      dataIndex: 'is_with_deduction',
      width: '18%',
      render: (text, record) => {
        const enableSelectedRows = _.includes(selectedRowKeys, record.docnum)
        return (
          <Radio.Group
            defaultValue={text}
            onChange={(e) => handleRadioChange(record, e)} disabled={!enableSelectedRows}
          >
            <Row>
              <Radio value='0%'>0%</Radio>
              <Radio value='2%'>2%</Radio>
            </Row>
          </Radio.Group>)
      }
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
          <Col>
           Amount: {total}
          </Col>
          <Col flex='180'>
            <Button onClick={onHide}>Cancel</Button>
            <Button type='primary' onClick={onSubmit}>Top Up</Button>
          </Col>
        </Row>
      }
    >
      <Table
        rowSelection={rowSelection}
        columns={walletColumns}
        dataSource={invocedTrips}
        rowKey={record => record.docnum}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
        loading={loading}
      />
    </Modal>
  )
}

export default walletTopup
