import React from 'react'
import { Modal, Button, Row, InputNumber, Col, Table, Popconfirm } from 'antd'
import { PhoneOutlined, DeleteOutlined } from '@ant-design/icons'

const PartnerUsers = (props) => {
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
      title={props.name}
      visible={props.visible}
      onCancel={props.onHide}
    >
      <Table
        columns={partnerUserColumn}
        dataSource={props.data}
        className='withAction'
        rowKey={record => record.id}
        size='small'
        pagination={false}
      />
      <Row className='mt10'>
        <Col flex='auto'>
          <InputNumber min={-10} max={10} placeholder='Enter Mobile Number' />
        </Col>
        <Col flex='90px'>
          <Button type='primary'>Add User</Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default PartnerUsers
