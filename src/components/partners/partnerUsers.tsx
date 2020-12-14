import { Radio, Button, Table, Modal, Form, Row, Col, Input, message, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useSubscription, useMutation, gql } from '@apollo/client'
import { useState, useContext } from 'react'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'
import Phone from '../common/phone'
import u from '../../lib/util'

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
mutation upsert_partner_mobile($mobile: String!, $partner_id: Int!, $is_primary: Boolean!, $updated_by: String!) {
  upsert_partner_mobile(mobile_no: $mobile, partner_id: $partner_id, is_primary: $is_primary, updated_by: $updated_by) {
    description
    status
  }
}`

const DELETE_PARTNER_USER_MUTATION = gql`
mutation partner_user_delete($id:Int!, $description: String, $topic: String, $created_by: String, $partner_id: Int!) {
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

const UPDATE_IS_ADMIN_USER = gql`
mutation partner_user($partner_id:Int,$mobile_id:Int){
  update:update_partner_user(where:{partner_id:{_eq:$partner_id},is_admin:{_eq:true}},_set:{is_admin:false}){
    returning{
      id
    }
  }
  insert:update_partner_user(where:{partner_id:{_eq:$partner_id},id:{_eq:$mobile_id}},_set:{is_admin:true}){
    returning {
      id
    }
  }
}
`
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

  let _data = {}
  if (!loading) {
    _data = data
  }
  const partner_users = get(_data, 'partner[0].partner_users', [])


  const [insertPartnerUser] = useMutation(
    INSERT_PARTNER_USERS_MUTATION,
    {
      onError(error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted(data) {
        setDisableButton(false)
        const status = get(data, 'upsert_partner_mobile.status', null)
        const description = get(data, 'upsert_partner_mobile.description', null)
        if (status === 'OK') {
          message.success(description || 'Updated!')
          form.resetFields()
        } else (message.error(description))
      }
    }
  )
  const [deletePartnerUser] = useMutation(
    DELETE_PARTNER_USER_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )
  const [is_admin_update] = useMutation(
    UPDATE_IS_ADMIN_USER,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() {
        message.success('Updated!!')
        onHide()
      }
    }
  )

  const onAddUser = (form) => {
    setDisableButton(true)
    insertPartnerUser({
      variables: {
        partner_id: partner.id,
        mobile: form.mobile,
        is_primary: false,
        updated_by: context.email
      }
    })
  }

  const onDelete = (record) => {
    deletePartnerUser({
      variables: {
        id: record.id,
        partner_id: partner.id,
        description: `${record.mobile}, is deleted!`,
        topic: 'User Deleted',
        created_by: context.email
      }
    })
  }
  const onIsAdminChange = (mobile_id) => {
    is_admin_update({
      variables: {
        partner_id: partner.id,
        mobile_id: mobile_id
      }
    })
  }

  const partnerUser = [
    {
      title: 'Mobile',
      render: (text, record) => {

        return (
          <Radio
            checked={record.is_admin}
            onChange={() => onIsAdminChange(record.id)}
          >
            <Phone number={record.mobile} />
          </Radio>
        )
      }
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (record) => (
        <span>
          <Phone number={record.mobileNo} />
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
      <Form form={form} onFinish={onAddUser}>
        <Row className='mt10' gutter={10}>
          <Col flex='auto'>
            <Form.Item name='mobile' initialValue=''>
              <Input 
                 type='number' 
                 placeholder='Enter Mobile Number' 
                 min={0}
                 maxLength={10}
                 onInput={u.handleLengthCheck}/>
            </Form.Item>
          </Col>
          <Col flex='90px'>
            <Button type='primary' loading={disableButton} htmlType='submit'>Add User</Button>
          </Col>
        </Row>
      </Form>
      <Table
        columns={partnerUser}
        dataSource={partner_users}
        size='small'
        pagination={false}
        scroll={{ x: 420 }}
        rowKey={(record) => record.id}
      />
    </Modal>
  )
}
export default PartnerUsers