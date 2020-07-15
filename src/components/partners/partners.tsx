import { Table, Input, Checkbox } from 'antd'
import mock from '../../../mock/partner/partnerData'
import PageLayout from '../layout/pageLayout'
import Link from 'next/link'
import {DownSquareOutlined } from '@ant-design/icons'


function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

const Partners = () => {
  const columnsCurrent = [
    {
      title: 'Partner Code',
      dataIndex: 'partnerCode',
              render: (text, record) => {
                return (
                  <Link href='partners/partner/[id]' as={`partners/partner/${record.id}`}>
                    <a>{text}</a>
                  </Link>
                )
              },
              filterDropdown: (
                <div > 
                  <Input placeholder="Search Partner code" />  
              </div>
            ),
            filterIcon:<DownSquareOutlined />  
    },
    {
      title: 'Partner',
      dataIndex: 'name',
            filterDropdown: (
                <div > 
                    <Input placeholder="Search Partner Name" />  
                </div>
              ),
            filterIcon:<DownSquareOutlined />
    },
    {
      title: 'Region',
      dataIndex: 'regionName',
            filterDropdown: (
              <div className='filterMenu'>
                  <Checkbox />
              </div>
            ),
            filterIcon:<DownSquareOutlined />
    },
    {
      title: 'Contact No',
      dataIndex: 'mobileNo',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Avg Km/day',
      dataIndex: 'averageKm',
      sorter: true
    },
    {
      title: 'Trucks',
      dataIndex: 'truckCount',
    },
    {
      title: 'Invoiced',
      dataIndex: 'invoiceAmount',
    },
    {
      title: 'Invoice Pending',
      dataIndex: 'invoicePendingAmount',
    },
    {
      title: 'Status',
      dataIndex: 'active',
            filterDropdown: (
              <div className='filterMenu'>
                  <Checkbox onChange={onChange}>Active</Checkbox>
                  <Checkbox onChange={onChange}>In-Active</Checkbox>
              </div>
            ),
            filterIcon:<DownSquareOutlined />
    }
  ]
  return (
    <PageLayout title='Partners'>
      <Table
        columns={columnsCurrent}
        dataSource={mock}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 800, y: 850 }}
        pagination={false}
      />
    </PageLayout>
  )
}

export default Partners
