import { Table, Tooltip, Button, Select, Space, message, Modal } from 'antd'
import { RocketFilled, DeleteOutlined, WhatsAppOutlined } from '@ant-design/icons'
import Link from 'next/link'
import moment from 'moment'
import { gql, useMutation } from '@apollo/client'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import get from 'lodash/get'

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
  const { leads } = props

  const initial = { cancel_visible: false, record: null }
  const { object, handleShow, handleHide } = useShowHideWithRecord(initial)

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

  const data = [{
    title: 'Partner Name',
    dataIndex: 'partner',
    key: 'partner',
    width: '30%',
    render: (text, record) => {
      const cardcode = record.partner && record.partner.cardcode
      const name = record.partner && record.partner.name
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
    render: (text, record) => record.partner && record.partner.partner_users && record.partner.partner_users[0].mobile
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
          />
          <Button type='link' icon={<RocketFilled />} />
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
        dataSource={leads}
        rowKey={record => record.id}
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
    </>
  )
}

export default ExcessLoadLead
