import { gql, useQuery } from '@apollo/client';
import get from 'lodash/get';
import { Modal, Table } from 'antd'
import u from '../../lib/util' 

const CUSTOMER_RECEIPTS = gql`query customer_receipts($cardcode: String) {
    customer(where: {cardcode: {_eq: $cardcode}}) {
      id
      cardcode
      customer_6month_receipts(order_by: {year_no: desc, month_no: desc}) {
        sum
        year_no
        month_no
      }
    }
  }
  `

const CustomerReceipts = (props) => {
    const { visible, onHide, cardcode } = props
    const { loading, error, data } = useQuery(CUSTOMER_RECEIPTS, {
        variables: {
            cardcode: cardcode,
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true
    })

  let _data = {}
  if (!loading) {
    _data = data
  }
  const customer_receipts = get(_data,'customer[0].customer_6month_receipts',[])
  const columns = [
      {
          title:'Month',
          dataIndex:'month_no',
          sorter: (a, b) => (a.month_no > b.month_no ? 1 : -1),
          width: '60%',
          render: (text, record) => {
            const year = get(record,'year_no',null)
            return (
              `${u.monthName(get(record,'month_no',null))} - ${get(record,'year_no',null)}`
            )
          }

      },
      {
          title:'Amount',
          dataIndex:'sum',
          sorter: (a, b) => (a.sum > b.sum ? 1 : -1),
          width:'40%'
      }

  ]
    return (
        <Modal
        title='Customer Receipts'
        visible={visible}
        onCancel={onHide}
        width={400}
        footer={null}
      >
        <Table
          columns={columns}
          dataSource={customer_receipts}
          rowKey={(record) => record.sum}
          size='small'
          pagination={false}
          loading={loading}
        />
      </Modal>
      )
}

export default CustomerReceipts