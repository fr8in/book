import { Modal, Button, Row, Input, Col, Table } from 'antd'

const Tripcomment = (props) => {
  const { visible, data, onHide } = props

  const columns = [{
    title: 'Previous Comments',
    dataIndex: 'description',
    key: 'message'
  },
  {
    dataIndex: 'created_by',
    key: 'userName'
  },
  {
    dataIndex: 'created_at',
    key: 'date'
  }]

  return (
    <Modal
      title='Comments'
      visible={visible}
      onCancel={onHide}
    >
      <Row gutter={10} className='mb10'>
        <Col flex='auto'>
          <Input.TextArea
            name='comment'
            placeholder='Please Enter Comments......'
          />
        </Col>
        <Col flex='80px'>
          <Button type='primary'>Submit</Button>
        </Col>
      </Row>
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
