import { Table, Button, Switch, message, Tooltip } from 'antd'
import Link from 'next/link'
import userContext from '../../../lib/userContaxt'
import { useState, useContext } from 'react'
import FastagSuspend from '../cards/fastagSuspend'
import FastagReversal from './fastagReversal'
import useShowHideWithRecord from '../../../hooks/useShowHideWithRecord'
import {
  DownloadOutlined,
  LeftCircleOutlined,
  StopOutlined
} from '@ant-design/icons'
import { gql, useQuery, useMutation } from '@apollo/client'
import get from 'lodash/get'
import u from '../../../lib/util'
import isEmpty from 'lodash/isEmpty'

const FASTAG_QUERY = gql`
query FastagsByPartner($partner_id: Int!) {
  partner(where: {id: {_eq: $partner_id}}) {
    fastags {
      mobile
      tag_id
      truck_no
      truck_id
      partner_id
      balance
      status
    }
    fastag_balance
  }
}`

const UPDATE_FASTAG_STATUS_MUTATION = gql`
mutation update_fastag_status($truckId:Int!,$status:Int!,$modifiedBy:String!){
  update_fastag(truck_id:$truckId,status:$status,modified_by:$modifiedBy){
    status
    description
  }
}`

const TOKEN_MUTATION = gql`
mutation token{
  token
}`

const FasTags = (props) => {
  const { partner_id } = props

  const initial = {
    suspendVisible: false,
    reversalVisible: false,
    suspendData: [],
    reversalData: []
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const [token, setToken] = useState('')
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]
  const access = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false

  const { loading, error, data } = useQuery(
    FASTAG_QUERY, {
      variables: {
        partner_id: partner_id
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    })
  console.log('FasTag error', error)

  const [updateFastagStatus] = useMutation(
    UPDATE_FASTAG_STATUS_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const [token_id] = useMutation(
    TOKEN_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const value = get(data, 'token', null)
        // message.success('Updated!!')
        setToken(value)
      }
    }
  )

  const onChange = (value, record) => {
    console.log('record', record, value)
    updateFastagStatus({
      variables: {
        truckId: record.truck_id,
        status: value ? 1 : 0,
        modifiedBy: context.email
      }
    })
  }

  const showModal = (record) => {
    token_id()
    handleShow('reversalVisible', null, 'reversalData', record)
  }

  var _data = {}
  if (!loading) {
    _data = data
  }
  const fastags = get(_data, 'partner[0].fastags', [])

  const CardsFastag = [
    {
      title: 'Tag Id',
      dataIndex: 'tag_id',
      key: 'tag_id',
      width: '16%'

    },
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
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
    {
      title: 'C.Status',
      dataIndex: 'cStatus',
      width: '7%',
      render: (text, record) =>
        <Switch
          size='small'
          defaultChecked
          onChange={(checked) => onChange(checked, record)} checked={text}
          disabled={!access}
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
          onClick={() => showModal(record)}
          disabled={!access}
        />
      )
    },
    {
      // title: (
      //   <Button size='small'>
      //     <Tooltip title='Suspend'><span>Sus.</span></Tooltip>
      //     <DownloadOutlined />
      //   </Button>
      // ),
      title: 'Suspend',
      width: '8%',
      render: (text, record) => (
        <Button
          size='small'
          type='primary'
          danger
          shape='circle'
          icon={<StopOutlined />}
          onClick={() => handleShow('suspendVisible', null, 'suspendData', record.truck_id)}
          disabled={!access}
        />
      )
    }
  ]

  return (
    <>
      <Table
        columns={CardsFastag}
        dataSource={fastags}
        rowKey={(record) => record.tag_id}
        size='small'
        scroll={{ x: 800 }}
        pagination={false}
        loading={loading}
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
          fastag={object.reversalData}
          onHide={handleHide}
          token={token}
        />
      )}
    </>
  )
}

export default FasTags
