import React from 'react'
import { Modal, Button, Row, Input, Col, Table, Popconfirm, Form } from 'antd'
import { PhoneOutlined, DeleteOutlined } from '@ant-design/icons'

const PartnerUsers = (props) => {
  const { title, visible, onHide } = props
  const userDelete = (value) => {
    console.log('changed', value)
  }
  const callNow = record => {
    window.location.href = 'tel:' + record
  }

  const partnerUserColumn = [
    {
      title: 'Mobile No',
      dataIndex: 'mobileNo',
      key: 'mobileNo'
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
        dataSource={props.data}
        className='withAction'
        rowKey={record => record.id}
        size='small'
        pagination={false}
      />
      <Row className='mt10' gutter={10}>
        <Col flex='auto'>
          <Form.Item>
            <Input type='number' min={-10} max={10} placeholder='Enter Mobile Number' />
          </Form.Item>
        </Col>
        <Col flex='90px'>
          <Button type='primary'>Add User</Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default PartnerUsers
