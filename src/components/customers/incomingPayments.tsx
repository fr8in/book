import incomingPaymentData from '../../../mock/customer/incomingdata'
import { Table } from 'antd'
import IncomingPaymentsLead from './incomingPaymentsLead'


const IncomingPayments = (props) => {
    const columns = [
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          width: '14%'
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          width: '14%'
        },
        {
          title: 'Booked',
          dataIndex: 'booked',
          key: 'booked',
          width: '14%'
        },
        {
          title: 'Balance',
          dataIndex: 'balance',
          key: 'balance',
          width: '16%'
        },
        {
          title: 'Remarks',
          dataIndex: 'remark',
          key: 'remark',
          width: '16%'
        }
    ]
    return (
        <Table
          columns={columns}
          expandedRowRender={record => <IncomingPaymentsLead {...record} />}
          dataSource={incomingPaymentData}
          rowKey={record => record.id}
          size='small'
          scroll={{ x: 1156 }}
          pagination={false}
        />
    
      )
    }
    export default IncomingPayments
