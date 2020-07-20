import { Table } from 'antd'
import data from '../../../mock/trip/additionalAdvance'

const AdditionalAdvance = () => {
  const columns = [
    {
      title: 'Type',
      dataIndex: 'paymentMode',
      width: '8%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '10%'
    },
    {
      title: 'Reason',
      dataIndex: 'comment',
      width: '34%'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '12%'
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      width: '22%'
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      render: (text, record) => {
        return text
      },
      width: '14%'
    }
  ]
  return (
    <div className='additonalAdv'>
      {data && data.length > 0
        ? (
          <Table
            columns={columns}
            dataSource={data}
            rowKey={record => record.id}
            size='small'
            scroll={{ x: 960 }}
            pagination={false}
          />)
        : <p>Additional advance not processed</p>}
    </div>
  )
}

export default AdditionalAdvance
