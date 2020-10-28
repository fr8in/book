import { useState} from 'react'
import { Table, Tooltip, Button, Select, Space, message, Modal } from 'antd'
import { RocketFilled, DeleteOutlined, WhatsAppOutlined } from '@ant-design/icons'
import Link from 'next/link'
import moment from 'moment'
import { gql, useMutation } from '@apollo/client'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import get from 'lodash/get'
import ConfirmPo from '../trips/confirmPo'

const DELETE_LEAD = gql`
mutation delete_lead($deleted_at: timestamp, $id: Int){
  update_lead(_set:{deleted_at: $deleted_at }, where:{id:{_eq: $id}}){
    returning{
      id
      deleted_at
    }
  }
}
`

const ExcessLoadLead = (props) => {
  const { record } = props

  const initial = { cancel_visible: false, record: null, po_visible: false, po_data: null }
  const { object, handleShow, handleHide } = useShowHideWithRecord(initial)

  const [truck_id, setTruck_id] = useState(null)

  const [delete_lead] = useMutation(
    DELETE_LEAD,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        handleHide()
      }
    }
  )

  const onCancelLead = (id) => {
    delete_lead({
      variables: {
        id: id,
        deleted_at: new Date().toISOString()
      }
    })
  }

  const onTruckChange = (id) => {
    setTruck_id(id)
  }

  const onPoClick = () => {
    handleShow('po_visible', null, 'po_data', record)
  }

  const data = [{
    title: 'Partner Name',
    dataIndex: 'partner',
    key: 'partner',
    width: '30%',
    render: (text, record) => {
      const cardcode = get(record, 'partner.cardcode', null)
      const name = get(record, 'partner.name', null)
      return (
        <Link href='/partners/[id]' as={`/partners/${cardcode} `}>
          {name && name.length > 12
            ? <Tooltip title={name}><a>{name.slice(0, 12) + '...'}</a></Tooltip>
            : <a>{name}</a>}
        </Link>)
    }
  },
  {
    title: 'Partner No',
    width: '20%',
    render: (text, record) => get(record, 'partner.partner_users[0].mobile', '-')
  },
  {
    title: 'Date',
    dataIndex: 'created_at',
    width: '20%',
    render: (text, record) => moment(text).format('DD-MMM-YY HH:mm')
  },
  {
    title: 'Action',
    render: (text, record) => {
      const trucks = get(record, 'partner.trucks', [])
      const trucks_list = trucks.map((data) => ({ value: data.id, label: data.truck_no }))
      return (
        <Space>
          <Select
            placeholder='Select truck...'
            options={trucks_list}
            optionFilterProp='label'
            showSearch
            onChange={onTruckChange}
          />
          <Tooltip title='Quick Po'>
            <Button type='link' icon={<RocketFilled />} disabled={!truck_id} onClick={onPoClick} />
          </Tooltip>
          <Tooltip title='Delete'>
            <Button type='link' danger icon={<DeleteOutlined />} onClick={() => handleShow('cancel_visible', null, 'record', record.id)} />
          </Tooltip>
          {/* <Tooltip title='Double Click to Copy Text'>
          <Button type='link' icon={<WhatsAppOutlined />} />
        </Tooltip> */}
        </Space>
      )
    },
    width: '30%'
  }
  ]

  return (
    <>
      <Table
        columns={data}
        dataSource={record.leads}
        rowKey={record => get(record, 'id', null)}
        size='small'
        scroll={{ x: 1156 }}
        pagination={false}
        className='withAction'
      />
      {object.cancel_visible &&
        <Modal
          visible={object.cancel_visible}
          title='Delete Lead'
          onCancel={handleHide}
          footer={[
            <Button key='back' onClick={handleHide}>No</Button>,
            <Button key='submit' type='primary' onClick={() => onCancelLead(object.record)}>Yes</Button>
          ]}
        >
          <p>Lead will get Deleted. Do you want to proceed?</p>
        </Modal>}
      {object.po_visible &&
        <ConfirmPo
          visible={object.po_visible}
          truck_id={truck_id}
          record={object.po_data}
          onHide={handleHide}
        />}
    </>
  )
}

export default ExcessLoadLead
