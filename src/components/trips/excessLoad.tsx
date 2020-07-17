import tripsData from '../../../mock/trip/tripsData'
import { Table, Tooltip, Button } from 'antd'
import Link from 'next/link'
import { RocketFilled, CloseCircleOutlined, CopyOutlined } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import ExcessLoadLead from './excessLoadLead'

const ExcessLoad = (props) => {
  const initial = { tripIdSearch: false }
  const { visible, onShow } = useShowHide(initial)

  const columns = [
    {
      title: 'LoadID',
      dataIndex: 'id',
      sorter: (a, b) => (a.id > b.id ? 1 : -1),
      width: '8%',
      render: (text, record) => {
        return (
          <Link href='/trips/[id]' as={`/trips/${record.id} `}>
            <a>{text}</a>
          </Link>)
      }
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      width: '14%'
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      key: 'destination',
      width: '14%'
    },
    {
      title: 'Truck Type',
      dataIndex: 'truck',
      key: 'truck',
      width: '14%'
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer',
      key: 'customer',
      width: '16%'
    },
    {
      title: 'S0 Price',
      dataIndex: 'soPrice',
      key: 'soPrice',
      width: '10%'
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      sorter: (a, b) => (a.createdOn > b.createdOn ? 1 : -1),
      width: '14%'
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span className='actions'>
          <Tooltip title='Cancel'>
            <Button type='link' icon={<CloseCircleOutlined />} onClick={() => onShow('cancel')} />
          </Tooltip>
          <Tooltip title='Double Click to Copy Text'>
            <Button type='link' disabled icon={<CopyOutlined />} onClick={() => onShow('copy text')} />
          </Tooltip>
          <span>
            <Tooltip title='Quick Po'>
              <Button type='link' icon={<RocketFilled />} />
            </Tooltip>
          </span>
        </span>
      ),
      width: '12%'
    }
  ]

  return (
    <Table
      columns={columns}
      expandedRowRender={record => <ExcessLoadLead {...record} />}
      dataSource={tripsData}
      className='withAction'
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 1156 }}
      pagination={false}
    />

  )
}

export default ExcessLoad
