
import { Modal, Button, Row, Input, Col, Table, Popconfirm, Form, message } from 'antd'
import { PhoneOutlined, DeleteOutlined } from '@ant-design/icons'
import { useSubscription, useMutation, gql } from '@apollo/client'
import { useState, useContext } from 'react'
import userContext from '../../lib/userContaxt'

const PARTNER_USERS_SUBSCRIPTION = gql`
subscription partner_user($cardcode: String){
  partner(where:{cardcode:{_eq:$cardcode}}){
    partner_users{
      id
      is_admin
      mobile
      name
    }
  }
}`

const INSERT_PARTNER_USERS_MUTATION = gql`
mutation partner_user_insert($name:String,$is_admin:Boolean,$mobile:String,$email:String,$partner_id:Int!, $description:String, $topic: String, $created_by: String) {
  insert_partner_user(
    objects: {
      name: $name,
      is_admin: $is_admin,
      mobile: $mobile,
      email:$email,
      partner_id: $partner_id
    }
  ) {
    returning {
      partner_id
      mobile
    }
  }
  insert_partner_comment(objects: {description: $description, partner_id: $partner_id, topic: $topic, created_by:$created_by}) {
    returning {
      description
      partner_id
    }
  }
}`

const DELETE_PARTNER_USER_MUTATION = gql`
mutation PartnerUserDelete($id:Int!, $description: String, $topic: String, $created_by: String, $partner_id: Int!) {
  delete_partner_user( where: {id: {_eq:$id}}) {
    returning {
      id
      mobile
    }
  }

  insert_partner_comment(objects: {description: $description, partner_id: $partner_id, topic: $topic, created_by:$created_by}) {
    returning {
      description
      partner_id
    }
  }
}`

const PartnerUsers = (props) => {
  const { visible, partner, onHide, title } = props
  const context = useContext(userContext)

  const [form] = Form.useForm()
  const [disableButton, setDisableButton] = useState(false)

  const { loading, error, data } = useSubscription(
    PARTNER_USERS_SUBSCRIPTION,
    {
      variables: { cardcode: partner.cardcode }
    }
  )

  const [insertPartnerUser] = useMutation(
    INSERT_PARTNER_USERS_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        form.resetFields()
      }
    }
  )

  const [deletePartnerUser] = useMutation(
    DELETE_PARTNER_USER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('PartnerUsers error', error)

  const onAddUser = (form) => {
    setDisableButton(true)
    insertPartnerUser({
      variables: {
        partner_id: partner.id,
        mobile: form.mobile,
        is_admin: false,
        email: `${form.mobile}.partner@fr8.in`,
        name: '',
        description: `Mobile No: ${form.mobile}, is added!`,
        topic: 'User Added',
        created_by: context.email
      }
    })
  }

  const onDelete = (record) => {
    deletePartnerUser({
      variables: {
        id: record.id,
        partner_id: partner.id,
        description: `Mobile No: ${record.mobile}, is deleted!`,
        topic: 'User Deleted',
        created_by: context.email
      }
    })
  }

  const { partner_users } = data.partner[0] ? data.partner[0] : [] && data.partner_users[0] ? data.partner_users[0] : []

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
          {!record.is_admin &&
            <Popconfirm title='Sure to delete?' onConfirm={() => onDelete(record)}>
              <Button type='link' danger icon={<DeleteOutlined />} />
            </Popconfirm>}
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
      <Form form={form} onFinish={onAddUser}>
        <Row className='mt10' gutter={10}>
          <Col flex='auto'>
            <Form.Item name='mobile' initialValue=''>
              <Input type='number' placeholder='Enter Mobile Number' />
            </Form.Item>
          </Col>
          <Col flex='90px'>
            <Button type='primary' loading={disableButton} htmlType='submit'>Add User</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default PartnerUsers
