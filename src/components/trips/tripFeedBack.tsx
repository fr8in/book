import { Modal, Button, Row, Input, Col, Table } from 'antd'

const Tripcomment = (props) => {
  const { visible, data, onHide } = props

  const columns = [{
    dataIndex: 'message',
    key: 'message'
  },
  {
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    dataIndex: 'date',
    key: 'date'
  }]

  return (
    <Modal
      title='Comments'
      visible={visible}
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
      <br />
      <Row><p>Previous Comments</p></Row>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={record => record.id}
        size='small'
        pagination={false}
      />
    </Modal>
  )
}
export default Tripcomment
