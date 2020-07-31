
import { Modal, Button, Row, Input, Col, Table, Popconfirm, Form , message } from 'antd'
import { PhoneOutlined, DeleteOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { useQuery , useMutation} from '@apollo/client'
import { PARTNER_USERS_QUERY } from './container/query/partnersUsersQuery'
import {INSERT_PARTNER_USERS_MUTATION} from './container/query/insertPartnerUsersMutation'

const PartnerUsers = (props) => {
  const { visible, partner, onHide, title } = props
  
 console.log('partnerId',partner)
  const [mobile, setMobile] = useState('')

  const { loading, error, data } = useQuery(
    PARTNER_USERS_QUERY,
    {
      variables: {cardcode: partner.cardcode },
      notifyOnNetworkStatusChange: true
    }
  )

  const [insertPartnerUser] = useMutation(
    INSERT_PARTNER_USERS_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('PartnerUsers error', error)

  const handleChange = (e) => {
    setMobile(e.target.value)
  }
 

  const onAddUser = () => {
    insertPartnerUser({
      variables: {
        partner_id : partner.id,
       mobile : mobile,
       is_admin :false,
       email :`${mobile}.partner@fr8.in`,
     name: ''
   
      }
    })
  }
  
  const { partner_users } = data.partner[0] ? data.partner[0] : [] && data.partner_users[0] ? data.partner_users[0] : []

  const userDelete = (value) => {
    console.log('changed', value)
  }
  const callNow = record => {
    window.location.href = 'tel:' + record
  }

  const partnerUserColumn = [
    {
      title: 'Mobile No',
      dataIndex: 'mobile',
      key: 'mobile'
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (record) => (
        <span>
          <Button type='link' icon={<PhoneOutlined />} onClick={() => callNow(record.mobileNo)} />
          <Popconfirm title='Sure to delete?' onConfirm={() => userDelete(record)}>
            <Button type='link' icon={<DeleteOutlined />} />
          </Popconfirm>
        </span>
      )
    }
  ]
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onHide}
      footer={[
        <Button
          type='default'
          key='back'
          onClick={onHide}
        >Close
        </Button>
      ]}
    >
      <Table
        columns={partnerUserColumn}
        dataSource={partner_users}
        className='withAction'
        rowKey={record => record.id}
        size='small'
        pagination={false}
      />
      <Row className='mt10' gutter={10}>
        <Col flex='auto'>
          <Form.Item>
            <Input type='number' value={mobile}  onChange={handleChange}  max={10} placeholder='Enter Mobile Number' />
          </Form.Item>
        </Col>
        <Col flex='90px'>
          <Button type='primary' onClick={onAddUser}>Add User</Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default PartnerUsers
