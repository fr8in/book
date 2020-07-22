import React from 'react'
import { Modal, Button, Row, Input, Col, Table } from 'antd'


const Tripcomment = (props) => {
  const { onHide } = props

  const columns = [{
    dataIndex: 'message',
    key: 'message',
  },
  {
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    dataIndex: 'date',
    key: 'date',
  }]

  return (
    <Modal
      title='Comments'
      visible={props.visible}
      onCancel={onHide}
    >
      <Row gutter={10}>
        <Col flex='auto'>
          <Input
            placeholder='Please Enter Comments......'
            type='textarea'
          />
        </Col>
        <Col flex='80px'>
          <Button type='primary'>Submit</Button>
        </Col>
      </Row>
      <br></br>
      <Row><p>Previous Comments</p></Row>
      <Table
        columns={columns}
        dataSource={props.data}
        rowKey={record => record.id}
        size='small'
        pagination={false}
      />
    </Modal>
  )
}
export default Tripcomment