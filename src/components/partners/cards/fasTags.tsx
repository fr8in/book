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

import Cards from '../../../../mock/card/cards'

const onChange = (checked) => {
  console.log(`switch to ${checked}`)
}

const FasTags = () => {
  const initial = {
    suspendVisible: false,
    reversalVisible: false,
    suspendData: [],
    reversalData: []
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const CardsFastag = [
    {
      title: 'Tag Id',
      dataIndex: 'tagId',
      key: 'tagId',
      width: '17%'
    },
    {
      title: 'Truck No',
      dataIndex: 'truckNo',
      key: 'truckNo',
      width: '9%',
      render: (text, record) => {
        return (
          <Link href='trucks/[id]' as={`trucks/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'ST Code',
      dataIndex: 'stCode',
      key: 'stCode',
      width: '8%'
    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      key: 'partner',
      width: '11%',
      render: (text, record) => {
        return (
          <Link href='partners/[id]' as={`partners/${record.id}`}>
            <a>{text}</a>
          </Link>
        )
      },
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
      title: 'Partner State',
      dataIndex: 'partnerStates',
      width: '10%'
    },
    {
      title: 'Tag Bal',
      dataIndex: 'tagBal',
      sorter: (a, b) => (a.tagBal > b.tagBal ? 1 : -1),
      width: '8%'
    },
    {
      title: 'T.Status',
      dataIndex: 'tStatus',
      width: '6%'
    },

    {
      title: 'C.Status',
      dataIndex: 'cStatus',
      width: '6%',
      render: () => <Switch size='small' defaultChecked onChange={onChange} />
    },
    {
      title: 'Reverse',
      dataIndex: 'Reverse',
      width: '7%',
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
      width: '7%',
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
        dataSource={Cards}
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
