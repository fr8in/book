import { Modal, Button, Row, Input, Col, Table } from 'antd'
import { useQuery } from '@apollo/client'
import { TRIP_COMMENT_QUERY } from './containers/query/tripCommentQuery'

const Tripcomment = (props) => {
  const { visible, trip_id, onHide } = props
  const { loading, error, data } = useQuery(
    TRIP_COMMENT_QUERY,
    {
      variables: {id:trip_id},
      notifyOnNetworkStatusChange: true
    }
  )

  if (loading) return null
  console.log('tripComment error', error)
  console.log('tripComment data', data.trip)
  const { trip_comments } = data.trip[0] ? data.trip[0] : []


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
        dataSource={trip_comments}
        rowKey={record => record.id}
        size='small'
        pagination={false}
      />
    </Modal>
  )
}
export default Tripcomment
