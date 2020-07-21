import { Table, Input} from 'antd'
import mock from '../../../mock/partner/partnerData'
import Link from 'next/link'
import {SearchOutlined } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'


 const regionList = [
  { value: 1, text: 'North' },
  { value: 2, text: 'South-1' },
  { value: 3, text: 'East-1' },
  { value: 4, text: 'West-1' },
  { value: 5, text: 'south-2' },
  { value: 6, text: 'East-2' },
  { value: 7, text: 'west-2' }
]
const statusList =[
  { value: 1, text: 'Active' },
  { value: 2, text: 'In-Active' },
]
 

const Partners = () => {
  const initial = { partnerCodeSearch: false }
  const { onShow } = useShowHide(initial)
  const columnsCurrent = [
    {
      title: 'Partner Code',
      dataIndex: 'partnerCode',
      key: 'partnerCode',
              render: (text, record) => {
                return (
                  <Link
                   href='partners/[id]'
                   as={`partners/${record.id}`}>
                    <a>{text}</a>
                  </Link>
                )
              },
              filterDropdown: (
                <div > 
                  <Input placeholder="Search Partner code" 
                  id='partnerCode'
                  name='partnerCode'
                  type='number'/>  
              </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilterDropdownVisibleChange: () => onShow('partnerCodeSearch') 
    },
    {
      title: 'Partner',
      dataIndex: 'name',
      key:'name',
            filterDropdown: (
                <div > 
                    <Input placeholder="Search Partner Name" 
                      id='name'
                      name='name'
                     />  
                </div>
              ),
              filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
              onFilterDropdownVisibleChange: () => onShow('partnerNameSearch') 
           
    },
    {
      title: 'Region',
      dataIndex: 'regionName',
      key:'regionName',
      filters:  regionList  
    },
    {
      title: 'Contact No',
      dataIndex: 'mobileNo',
      key:'mobileNo',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key:'email',
    },
    {
      title: 'Avg Km/day',
      dataIndex: 'averageKm',
      key:'averageKm',
      sorter: true,

    },
    {
      title: 'Trucks',
      dataIndex: 'truckCount',
      key:'truckCount',
    },
    {
      title: 'Invoiced',
      dataIndex: 'invoiceAmount',
      key:'invoiceAmount',
    },
    {
      title: 'Invoice Pending',
      dataIndex: 'invoicePendingAmount',
      key:'invoicePendingAmount',
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key:'active',
      filters : statusList
    }
  ]
  return (
    
      <Table
        columns={columnsCurrent}
        dataSource={mock}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 1156, y: 850 }}
        pagination={false}
      />
  )
}

export default Partners
