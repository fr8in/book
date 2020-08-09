import { Table, Button, Switch, Input } from 'antd'
import Link from 'next/link'
import FastagSuspend from '../cards/fastagSuspend'
import FastagReversal from './fastagReversal'
import useShowHideWithRecord from '../../../hooks/useShowHideWithRecord'
import {
  DownloadOutlined,
  LeftCircleOutlined,
  StopOutlined,
  SearchOutlined
} from '@ant-design/icons'
//import Cards from '../../../../mock/card/cards'

const FasTags = (props) => {
 const { fastag }= props
  const initial = {
    suspendVisible: false,
    reversalVisible: false,
    suspendData: [],
    reversalData: []
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
 
 
 const onChange = (checked) => {
  console.log(`switch to ${checked}`)
}
  const CardsFastag = [
    {
      title: 'Tag Id',
      dataIndex: 'tagId',
      key: 'tagId',
      width: '17%',
    },
    {
      title: 'Truck No',
      key: 'truckNo',
      width: '9%',
      render: (text, record) => {
        const truckNo = record.truck && record.truck.truck_no
        return (
          <Link href='trucks/[id]' as={`trucks/${truckNo}`}>
            <a>{truckNo}</a>
          </Link>
        )
      }
    },
    {
      title: 'ST Code',
      key: 'stCode',
      width: '8%',
      render: (text, record) => {
        const partner_id = record.partner && record.partner.cardcode
        return (
          <Link href='partners/[id]' as={`partners/${partner_id}`}>
            <a>{partner_id}</a>
          </Link>
        )
      }
    },
    {
      title: 'Partner',
      key: 'partner',
      width: '12%',
      render: (text, record) => record.partner && record.partner.name,
      filterDropdown: (
        <div>
          <Input placeholder='Search' id='partner' name='partner' type='number' />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Tag Bal',
      dataIndex: 'balance',
      sorter: (a, b) => (a.tagBal > b.tagBal ? 1 : -1),
      width: '8%'
    },
    {
      title: 'T.Status',
      render: (text, record) => record.tag_status && record.tag_status.status,
      width: '11%'
    },

    {
      title: 'C.Status',
      dataIndex: 'cStatus',
      width: '8%',
      render: () => <Switch size='small' defaultChecked onChange={onChange} />
    },
    {
      title: 'Reverse',
      dataIndex: 'Reverse',
      width: '8%',
      render: (text, record) => (
        <Button
          size='small'
          shape='circle'
          type='primary'
          className='btn-success'
          icon={<LeftCircleOutlined />}
          onClick={() => handleShow('reversalVisible', null, 'reversalData', record)}
        />
      )
    },
    {
      title: (
        <Button size='small'>
          Sus.
          <DownloadOutlined />
        </Button>
      ),
      width: '8%',
      render: (text, record) => (
        <Button
          size='small'
          type='primary'
          danger
          shape='circle'
          icon={<StopOutlined />}
          onClick={() => handleShow('suspendVisible', null, 'suspendData', record)}
        />
      )
    }
  ]

  return (
    <>
      <Table
        columns={CardsFastag}
        dataSource={fastag}
        rowKey={(record) => record.tagId}
        size='small'
        scroll={{ x: 1156, y: 400 }}
        pagination={false}
      />

      {object.suspendVisible && (
        <FastagSuspend
          visible={object.suspendVisible}
          data={object.suspendData}
          onHide={handleHide}
        />
      )}
      {object.reversalVisible && (
        <FastagReversal
          visible={object.reversalVisible}
          data={object.reversalData}
          onHide={handleHide}
        />
      )}
    </>
  )
}

export default FasTags
