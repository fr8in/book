import { Table, Input,Tooltip} from 'antd'
// import mock from '../../../mock/partner/partnerData'
import Link from 'next/link'
import {SearchOutlined } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'

const statusList =[
  { value: 1, text: 'Active' },
  { value: 2, text: 'In-Active' },
]
 
const Partners = (props) => {
  const { partners,region} = props
  console.log(props)
  const initial = { partnerCodeSearch: false }
  const { onShow } = useShowHide(initial)
  const columnsCurrent = [
    {
      title: 'Partner Code',
      dataIndex: 'cardcode',
      key: 'cardcode',
      width:'7',
              render: (text, record) => {
                return (
                  <Link
                   href='partners/[id]'
                   as={`partners/${record.cardcode}`}>
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
      width:'15',
      render: (text, record) => {
        return (
          text ? (
            <Tooltip title={text}><span>{text.slice(0, 15) + '...'}</span></Tooltip>
          ) : null
        )
      },
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
      width:'8',
      filters: region 
    },
    {
      title: 'Contact No',
      dataIndex: 'mobileNo',
      key:'mobileNo',
      width:'10',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key:'email',
      width:'14',
    },
    {
      title: 'Avg Km/day',
      dataIndex: 'averageKm',
      key:'averageKm',
      width:'9',
      sorter: true,

    },
    {
      title: 'Trucks',
      dataIndex: 'truckCount',
      key:'truckCount',
      width:'7',
    },
    {
      title: 'Invoiced',
      dataIndex: 'invoiceAmount',
      key:'invoiceAmount',
      width:'9',
    },
    {
      title: 'Invoice Pending',
      dataIndex: 'invoicePendingAmount',
      key:'invoicePendingAmount',
      width:'12',
    },
    {
      title: 'Status',
      width:'9',
      filters : statusList,    
      render: (record) => { 
        return (record.partner_status.value)
        }
    }
  ]
  return (
      <Table
        columns={columnsCurrent}
        dataSource={partners}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 1156, y: 850 }}
        pagination={false}
      />
  )
}

export default Partners
