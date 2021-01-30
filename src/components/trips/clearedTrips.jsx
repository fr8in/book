import { Modal, Table } from 'antd'
import get from 'lodash/get'
import { gql, useQuery } from '@apollo/client'
import moment from 'moment'

const PARTNER_CLEARED_TRIPS = gql`
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

  const { loading, data, error } = useQuery(
    PARTNER_CLEARED_TRIPS,
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

  const invoiced = get(_data, 'partner[0].invoiced', [])

  const walletColumns = [
    {
      title: 'Trip Id',
      dataIndex: 'trip_id',
      width: '20%',
      sorter: (a, b) => (a.trip_id - b.trip_id)
    },
    {
      title: 'AP Date',
      dataIndex: 'date',
      width: '20%',
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
      width: '20%',
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
      width: '20%',
      sorter: (a, b) => (a.amount > b.amount ? 1 : -1),
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      width: '20%',
      render: (text, record) => text,
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1)
    }
  ]

  return (
    <Modal
      title='Cleared'
      visible={visible}
      onCancel={onHide}
      width={750}
      bodyStyle={{ padding: 20 }}
      style={{ top: 20 }}
      footer={[]}
    >
      <Table
        columns={walletColumns}
        dataSource={invoiced}
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
