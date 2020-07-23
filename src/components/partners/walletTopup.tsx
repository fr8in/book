import {useState} from 'react'
import { Modal, Table,Row,Button,Col} from 'antd'
import WalletData from '../../../mock/partner/walletTopUp'


const walletTopup = (props) => {
  const { visible, onHide } = props
  const [selectionType, setSelectionType] = useState('checkbox');
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', 
      name: record.name,
    }),
  };
  const onSubmit = () => {
    console.log('wallet Top Up!')
    onHide()
  }
  const columnsCurrent = [
    {
      title: 'Order Id',
      dataIndex: 'orderId',
    },
    {
      title: 'AP Date',
      dataIndex: 'apDate'
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate'
    },
    {
      title: 'Price',
      dataIndex: 'price'
    },
    {
        title: 'Balance',
        dataIndex: 'balance'
      },
      {
        title: 'Top Up',
        dataIndex: 'topUp'
      },
      {
        title: 'Deduction',
        dataIndex: 'deduction'
      },
]
    return (
       <Modal
       title='Wallet Top Up'
       visible={visible}
       onOk={onSubmit}
       onCancel={onHide}
       width={900}
       bodyStyle={{ padding: 20 }}
       footer={
       <Row justify='start' className='m5'>
         <Col >
           Total:0
           </Col>
           <Col flex='180'>
           <Button > Cancel </Button>
            <Button type="primary">Top Up </Button>
            </Col>
        </Row>}
       >
          <Table
           rowSelection={{
            ...rowSelection,
          }}
            columns={columnsCurrent}
            dataSource={WalletData}
            rowKey={record => record.id}
            size='middle'
            scroll={{ x: 800, y: 400 }}
            pagination={false}
          />
       </Modal>
      )
    }
  
    export default walletTopup