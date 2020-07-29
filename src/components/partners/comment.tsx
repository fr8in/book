
import { Row, Col, Table, Input, Button } from 'antd'
import Mock from '../../../mock/partner/comment'

const Comment = () => {
  const columnsCurrent = [
    {
      title: 'Comment',
      dataIndex: 'message',
      width: '35'
    },
    {
      title: 'Created By',
      dataIndex: 'userName',
      width: '35'
    },
    {
      title: 'Created On',
      dataIndex: 'date',
      width: '30'
    }
  ]
  return (
    <div>
      <Row className='p10' gutter={10}>
        <Col xs={24} sm={18}><Input.TextArea placeholder='Please enter comments' /></Col>
        <Col xs={4}><Button type='primary'>Submit</Button></Col>
      </Row>
      <Table
        columns={columnsCurrent}
        dataSource={Mock}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
    </div>

  )
}

export default Comment
