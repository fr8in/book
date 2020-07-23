import { Table } from 'antd'
import newCusMock from '../../../mock/customer/newCusMock'

const CustomerKyc = () => {
  const newCustomer = [
    {
      title: 'User Name',
      dataIndex: 'name'
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName'
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobileNo'
    },
    {
      title: 'Customer Type',
      dataIndex: 'companyType'
    },
    {
      title: 'Reg Date',
      dataIndex: 'registrationDate'
    },
    {
      title: 'PAN',
      dataIndex: 'panNo'
    },
    {
      title: 'Credit Limit',
      dataIndex: 'type'
    },
    {
      title: 'Default Mamul',
      dataIndex: 'mamul'
    },
    {
      title: 'Advance %',
      dataIndex: 'advancePercentage'
    },
    {
      title: 'Action'
    }
  ]

  return (
    <Table
      columns={newCustomer}
      dataSource={newCusMock}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default CustomerKyc
