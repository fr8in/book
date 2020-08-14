import { Row, Col, Form, Input, Upload, Button ,message} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'

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
  const {trip_id} = props

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
                <Upload>
                  <Button>
                    <UploadOutlined /> Select File
                  </Button>
                </Upload>
                <Button
                  type='primary'
                  disabled
                  style={{ marginTop: 10 }}
                >
                  {'Start Upload'}
                </Button>
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
