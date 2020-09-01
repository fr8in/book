import { Table, Button, Switch, message } from 'antd'
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
import { gql,useQuery,useMutation } from '@apollo/client'
import get from 'lodash/get'

const FASTAG_QUERY = gql`
query all($partner_id: Int!) {
  partner(where: {id: {_eq: $partner_id}}) {
    fastags {
      mobile
      tag_id
      truck_no
      truck_id
      balance
      status
    }
    fastag_balance
  }
}
`
const UPDATE_FASTAG_STATUS_MUTATION = gql`
mutation update_fastag_status($truckId:Int!,$status:Int!,$modifiedBy:String!){
  update_fastag(truck_id:$truckId,status:$status,modified_by:$modifiedBy)
  {
    status
    description
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
      FASTAG_QUERY, {
        variables:{
          partner_id:partner_id
        },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    })
    console.log('FasTag error', error)
    console.log('FasTag data', data)
  
    const [updateFastagStatus] = useMutation(
      UPDATE_FASTAG_STATUS_MUTATION,
      {
        onError (error) { message.error(error.toString()) },
        onCompleted () { message.success('Updated!!') }
      }
    )
    const onChange = (value,record) => {
      console.log('record', record,value)
      updateFastagStatus({
        variables: {
          truckId: record.truck_id,
          status: value == true ? 1 : 0,
          modifiedBy: "pravalika.k@fr8.in"
        }
      })
     
    }
    

    var _data = {}
    if (!loading) {
      _data = data
    }
    const fastags = get(_data, 'partner[0].fastags', [])
    console.log('fastags',fastags)

  const CardsFastag = [
    {
      title: 'Tag Id',
      dataIndex:'tag_id',
      key: 'tag_id',
      width: '16%',
     
    },
    {
      title: 'Truck No',
      dataIndex:'truck_no',
      key: 'truck_no',
      width: '8%',
      render: (text, record) => {
        return (
          <Link href='trucks/[id]' as={`trucks/${text}`}>
            <a>{text}</a>
          </Link>
        )
      }
    },
  
    {
      title: 'Tag Bal',
      dataIndex: 'balance',
      sorter: (a, b) => (a.tagBal > b.tagBal ? 1 : -1),
      width: '7%'
    },
    // {
    //   title: 'T.Status',
    //   render: (text, record) => record.tag_status && record.tag_status.status,
    //   width: '10%'
    // },

    {
      title: 'C.Status',
      dataIndex: 'cStatus',
      width: '7%',
      render: (text,record) => 
      <Switch size='small' 
      defaultChecked 
      onChange={(checked) => onChange(checked, record)} checked={text}
       />
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
          onClick={() => handleShow('suspendVisible', null, 'suspendData', record.truck_id)}
        />
      )
    }
  ]

  return (
    <>
      <Table
        columns={CardsFastag}
        dataSource={fastags}
        rowKey={(record) => record.tagId}
        size='small'
        scroll={{ x: 1156, y: 400 }}
        pagination={false}
      />

      {object.suspendVisible && (
        <FastagSuspend
          visible={object.suspendVisible}
          truck_id={object.suspendData}
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
