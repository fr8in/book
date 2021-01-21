import { useState, useEffect } from 'react'
import { Modal, Table } from 'antd'
import _ from 'lodash'
import { gql, useQuery } from '@apollo/client'
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


const ClearedList = (props) => {
  const { visible, onHide, partner_id } = props

  const [invocedTrips, setInvoicedTrips] = useState([])

  const { loading, data, error } = useQuery(
    PARTNER_MANUAL_TOPUP,
    {
      variables: { id: partner_id },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('ClearedList error', error)

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


  const walletColumns = [
    {
      title: 'Trip Id',
      dataIndex: 'trip_id',
      key: 'loadid',
      width: '15%',
      sorter: (a, b) => (a.id > b.id ? 1 : -1)
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
      // defaultSortOrder: 'ascend'
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
      width={750}
      bodyStyle={{ padding: 20 }}
      style={{ top: 20 }}
      footer={[]}
    >
      <Table
        columns={walletColumns}
        dataSource={invocedTrips}
        rowKey={record => record.docnum}
        size='small'
        scroll={{ x: 650, y: 550 }}
        pagination={false}
        loading={loading}
      />
    </Modal>
  )
}

export default ClearedList
