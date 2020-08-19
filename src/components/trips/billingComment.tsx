import { Row, Col, Form, Input, Button ,message} from 'antd'
import { gql, useMutation } from '@apollo/client'
import FileUpload from '../common/fileUpload'

const BILLING_COMMENT_MUTATION = gql`
mutation updateBillingComment($id: Int!, $billing_remarks: String){
  update_trip(_set: {billing_remarks: $billing_remarks}, where: {id: {_eq:$id}}) {
    returning {
      billing_remarks
    }
  }
}
`

const BillingComment = (props) => {
  const {trip_id,trip_info} = props

  const [billingRemarks] = useMutation(
    BILLING_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const billingRemark = (form) => {
    console.log('form',form)
    billingRemarks({
      variables: {
        id: trip_id,
        billing_remarks: form.billing_remarks
      }
    }) 
  }

  const Evidence_List_files = trip_info && trip_info.trip_files && trip_info.trip_files.length > 0 ? trip_info.trip_files.filter(file => file.type === 'EVIDENCELIST') : null
  const evidence_file_list = Evidence_List_files && Evidence_List_files.length > 0 && Evidence_List_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })
console.log('evidence_file_list',evidence_file_list)
  return (
    <Row>
      <Col xs={24}>
        <Form layout='vertical' onFinish={billingRemark}>
          <Row gutter={10}>
            <Col xs={12}>
              <Form.Item label='Remarks'  name='billing_remarks'>
                <Input
                  id='remarks'
                  placeholder='Remarks'
                  disabled={false}
                />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <div >
                <h4>Evidence</h4>
                <FileUpload
                id={trip_id}
                type='trip'
                folder='approvals/'
                file_type='EVIDENCELIST'
                file_list={evidence_file_list}
              />
              </div>
            </Col>
            <Col xs={6}>
              <Form.Item label='save' className='hideLabel'>
                <Button htmlType='submit' type='primary'>Save</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  )
}

export default BillingComment
