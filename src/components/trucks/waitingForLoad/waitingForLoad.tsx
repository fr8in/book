import loadData from '../../../../mock/trucks/loadData'
import { Table, Tooltip, Badge, Button } from 'antd'
import Link from 'next/link'
import { PhoneOutlined, CommentOutlined, WhatsAppOutlined, RocketFilled } from '@ant-design/icons'
import useShowHide from '../../../hooks/useShowHide'

const WaitingForLoad = () => {
  const initial = { comment: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const callNow = record => {
    window.location.href = 'tel:' + record
  }

  const columns = [
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
      width: '14%',
      sorter: (a, b) => (a.truckNo > b.truckNo ? 1 : -1),
      className: 'pl10',
      render: (text, record) => {
        return (
          <span>
            {record.statusId === 7 &&
              <Badge dot style={{ backgroundColor: ('#007dfe') }} />}
            <Link href='/trucks/truck/[id]' as={`/trucks/truck/${record.id} `}>
              <a>{text}</a>
            </Link>
          </span>
        )
      }
    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      width: '12%',
      sorter: (a, b) => (a.partner > b.partner ? 1 : -1),
      render: (text, record) => {
        return (
          <span>
            <Badge dot style={{ backgroundColor: (record.partnerMembershipId === 0 ? '#FFD700' : '#C0C0C0') }} />
            <Link href='/partners/partner/[id]' as={`/partners/partner/${record.partnerId} `}>
              <a>{text && text.length > 20
                ? <Tooltip title={`${text}, ${record.noOfLoadsTaken}, ${record.partnerEngagementPercent}%`}>
                  {`${text.slice(0, 20)}...`}
                  </Tooltip>
                : text}
              </a>
            </Link>
          </span>
        )
      }
    },
    {
      title: 'Partner No',
      dataIndex: 'partnerNo',
      width: '10%'
    },
    {
      title: 'City',
      dataIndex: 'city',
      width: '14%',
      sorter: (a, b) => (a.city > b.city ? 1 : -1)
    },
    {
      title: 'TAT',
      dataIndex: 'tat',
      width: '7%',
      sorter: (a, b) => (a.tat > b.tat ? 1 : -1)
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      width: '27%'
    },
    {
      title: 'Action',
      render: (text, record) => {
        return (
          <span className='actions'>
            <Tooltip title={record.driverPhoneNo}>
              <Button type='link' icon={<PhoneOutlined />} onClick={() => callNow(record.driverPhoneNo)} />
            </Tooltip>
            <Tooltip title='Comment'>
              <Button type='link' disabled icon={<CommentOutlined />} onClick={() => onShow('comment')} />
            </Tooltip>
            <span>
              <Tooltip title='click to copy message'>
                <Button type='link' icon={<WhatsAppOutlined />} />
              </Tooltip>
            </span>
            <span>
              <Tooltip title='Quick PO'>
                <Button type='link' icon={<RocketFilled />} onClick={() => onShow('poModal')} />
              </Tooltip>
            </span>
          </span>
        )
      },
      width: '12%'
    }
  ]
  return (
    <Table
      columns={columns}
      dataSource={loadData}
      className='withAction'
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 1156, y: 210 }}
      pagination={false}
    />
  )
}

export default WaitingForLoad
