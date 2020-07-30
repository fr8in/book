import { Modal, Button, Row, Input, Col, Table, message } from 'antd'
import { useQuery , useMutation} from '@apollo/client'
import { PARTNER_COMMENT_QUERY } from './container/query/partnerCommentQuery'
import { INSERT_PARTNER_COMMENT_MUTATION } from './container/query/updatePartnerCommentMutation'


const PartnerComment = (props) => {
  const { visible, partnerId, onHide } = props
  const { partner_id, created_by, description , topic } =props
  const { loading, error, data } = useQuery(
    PARTNER_COMMENT_QUERY,
    {
      variables: { id: partnerId },
      notifyOnNetworkStatusChange: true
    }
  )

  const [InsertComment] = useMutation(
    INSERT_PARTNER_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('PartnerComment error', error)
  console.log('PartnerComment data', data.partner)
  const { partner_comments } = data.partner[0] ? data.partner[0] : []


  const onChange = () => {
    InsertComment({
      variables: {
        partner_id ,
        created_by,
        description ,
        topic,
      }
    })
  }

  const columns = [{
    title: 'Previous Comments',
    dataIndex: 'description',
    key: 'description'
  },
  {
    dataIndex: 'created_by',
    key: 'created_by'
  },
  {
    dataIndex: 'created_at',
    key: 'created_at'
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
          <Button type='primary'  onChange={onChange} >Submit</Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={partner_comments}
        rowKey={record => record.id}
        size='small'
        pagination={false}
      />
    </Modal>
  )
}
export default PartnerComment
