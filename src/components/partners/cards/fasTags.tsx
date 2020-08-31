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
import { gql,useQuery } from '@apollo/client'
import get from 'lodash/get'

const FUEL_CARD_QUERY = gql`
query all($partner_id: Int!) {
  partner(where: {id: {_eq: $partner_id}}) {
    name
    cardcode
    fastags {
      mobile
      tag_id
      truck_no
      balance
      status
    }
    fastag_balance
  }
}
`

const FasTags = (props) => {

  const {partner_id} = props

  const initial = {
    suspendVisible: false,
    reversalVisible: false,
    suspendData: [],
    reversalData: []
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
 
  console.log('partner_id',partner_id)
    const { loading, error, data } = useQuery(
      FUEL_CARD_QUERY, {
        variables:{
          partner_id:partner_id
        },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    })
    console.log('FasTag error', error)
    console.log('FasTag data', data)
  
    var _data = {}
    if (!loading) {
      _data = data
    }
    const partner = get(_data, 'partner', [])
    const fas_tag = get(_data,'partner[0].fastags',[])
    console.log('fastag',fas_tag)
 console.log('partner',partner)
 const onChange = (checked) => {
  console.log(`switch to ${checked}`)
}
  const CardsFastag = [
    {
      title: 'Tag Id',
      key: 'tagId',
      width: '16%',
      render: (text, record) =>record && record.fastags[0] && record.fastags[0].tag_id,
    },
    {
      title: 'Truck No',
      key: 'truckNo',
      width: '8%',
      render: (text, record) => {
        const truckNo = record && record.fastags[0] && record.fastags[0].truck_no
        return (
          <Link href='trucks/[id]' as={`trucks/${truckNo}`}>
            <a>{truckNo}</a>
          </Link>
        )
      }
    },
    {
      title: 'ST Code',
      key: 'cardcode',
      width: '7%',
      render: (text, record) => {
        const partner_id = record && record.cardcode
        return (
          <Link href='partners/[id]' as={`partners/${partner_id}`}>
            <a>{partner_id}</a>
          </Link>
        )
      }
    },
    {
      title: 'Partner',
      dataIndex: 'name',
      key: 'partner',
      width: '11%'
    },
    {
      title: 'Partner State',
     // dataIndex: 'name',
      key: 'partner',
      width: '8%'
    },
    {
      title: 'Tag Bal',
      dataIndex: 'fastag_balance',
      sorter: (a, b) => (a.tagBal > b.tagBal ? 1 : -1),
      width: '7%'
    },
    {
      title: 'T.Status',
      render: (text, record) => record.tag_status && record.tag_status.status,
      width: '10%'
    },

    {
      title: 'C.Status',
      dataIndex: 'cStatus',
      width: '7%',
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
        dataSource={partner}
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
