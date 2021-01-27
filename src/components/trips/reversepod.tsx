import {  Button, Input, Row, Form, message, Table } from 'antd'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useState, useContext, } from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import LinkComp from '../common/link'
import moment from 'moment'
import PartnerLink from '../common/PartnerLink'
import Truncate from '../common/truncate'

const UPDATE_REVERSE_POD_DISPATCH = gql`
mutation ReversePodDispatch ($trip_id:[Int!]){
  update_trip(_set:{pod_dispatched_at:null}where:{trip_pod_dispatch:{trip_id:{_in:$trip_id}}}){
    returning{
      id
    }
  }
  delete_trip_pod_dispatch(where:{trip_id:{_in:$trip_id}}){
    returning{
      id
    }
  }
}
`
const TRIP = gql` 
query trip($docket:String){
  trip(where:{trip_pod_dispatch:{docket:{_eq:$docket}}}){
    id
    created_at
    trip_pod_dispatch{
      docket
    }
    customer{
      name
    }
    partner{
      name
    }
    truck{
      truck_no
    }
    destination{
      name
    }
    source{
      name
    }
  }
}`

const insert_comment = gql`
mutation insert_comment($object_bool: [trip_comment_insert_input!]!) {
  insert_trip_comment(objects: $object_bool) {
    returning {
      id
    }
  }
}`

const Reversepod= (props) => {
  const { onHide } = props
  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)
  const [form] = Form.useForm()

  const [selectedTrip, setSelectedTrip] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    const trip_list = selectedRows && selectedRows.length > 0 ? selectedRows.map(row => row.id) : []
    setSelectedRowKeys(selectedRowKeys)
    setSelectedTrip(trip_list)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const [insertcomment] = useMutation(
    insert_comment
  )

  const [updateReversepoddispatch] = useMutation(
    UPDATE_REVERSE_POD_DISPATCH,
    {
      onError(error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted(data) {
        setDisableButton(false)
        message.success('Reverse!!')
        onHide()
        const trip_id = get(data, 'update_trip.returning', [])
        const commentList = !isEmpty(data) ? trip_id.map((data) => {
          return {
            created_by: context.email,
            description: `${form.getFieldValue('docket_no')} Changed by ${context.email}`,
            topic: "Reverse Docket No",
            trip_id: data.id
          }
        }) : []
        insertcomment({
          variables: {
            object_bool: commentList
          }
        })
      }
    }
  )


  const [getTrip_id, { data, loading, refetch }] = useLazyQuery(TRIP, {
    variables: {
      docket: form.getFieldValue('docket_no')
    },
    onCompleted() {
      refetch()
    }
  }
  )


  let _trip = []
  if (!loading) {
    _trip = get(data, 'trip', null)
  }
  

  const trip_id = () => {
    if (form.getFieldValue('docket_no')) {
      getTrip_id({ variables: { docket: form.getFieldValue('docket_no') } })
    } else return null
  }

  
  const onChange = () => {
      if(selectedRowKeys.length > 0) {
    setDisableButton(true)
    updateReversepoddispatch({
      variables: {
        trip_id: selectedRowKeys
      }
    })
} else {
    message.error('select the trip')
}
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
      render: (text, record) => {
        return (
          <LinkComp type='trips' data={text} id={record.id} />)
      }
    },
    {
        title: 'Docket No',
        render: (text, record) => {
            const Docket = get(record, 'trip_pod_dispatch.docket', null)
            return <Truncate data={Docket} length={10} />
        },
        width: '10%'
      },
    {
      title: 'Order date',
      dataIndex: 'created_at',
      render: (text, record) => {
        return text ? (
          moment(text).format('DD-MMM-YY')
        ) : ''
      },
      width: '10%'
    },
    {
      title: 'Customer',
      render: (text, record) => {
        const cardcode = record.customer && record.customer.cardcode
        return (
          <LinkComp type='customers' data={get(record, 'customer.name', null)} id={cardcode} length={12} />
        )
      },
      width: '20%'
    },
     {
          title: 'Partner',
          render: (text, record) => {
            return (
              <PartnerLink type='partners' data={get(record, 'partner.name', null)} id={get(record, 'partner.id', null)} cardcode={get(record, 'partner.cardcode', null)} length={12} />
            )
          },
          width: '20%'
        },
    {
      title: 'Truck',
      render: (text, record) => {
        return (
          <LinkComp type='trucks' data={get(record, 'truck.truck_no', null)} id={get(record, 'truck.truck_no', null)} />
        )
      },
      width: '10%'
    },
    {
      title: 'Source',
      width: '10%',
      render: (text, record) => {
        const source = get(record, 'source.name', null)
        return <Truncate data={source} length={10} />
      }
    },
    {
      title: 'Destination',
      width: '10%',
      render: (text, record) => {
        const source = get(record, 'destination.name', null)
        return <Truncate data={source} length={10} />
      }
    }  
  ]


  return (
    
      <Form layout='vertical' onFinish={onChange} form={form}>
        <Form.Item label='Docket No' name='docket_no' >
          <Input placeholder='Enter the Docket No' onBlur={trip_id} />
        </Form.Item>
        <Form.Item>
        <Table
        columns={columns}
        dataSource={_trip}
        rowKey={record => record.id}
        rowSelection={{...rowSelection}}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
        loading={loading}
        className='withAction'
      />
        </Form.Item>
        <Row justify='end'>
          <Button type='primary' loading={disableButton} htmlType='submit'>Reverse</Button>
        </Row>
      </Form>
   
  )
}
export default Reversepod
