import { Row, Col, Form, Input, Upload, Button ,message} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import {useState} from "react";

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

  const [BillingRemarks, setBillingRemarks] = useState('')

  const changesetBillingRemarks = (e) => {
    setBillingRemarks(e.target.value)
  }
  console.log('BillingRemarks', BillingRemarks)

  const [billingRemarks] = useMutation(
    BILLING_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const billingRemark = () => {
    console.log('trip_id',trip_id)
    billingRemarks({
      variables: {
        "id": trip_id,
        "billing_remarks": BillingRemarks
      }
    })
  }

  return (
    <Row>
      <Col xs={24}>
        <Form layout='vertical'>
          <Row gutter={10}>
            <Col xs={12}>
              <Form.Item label='Remarks'>
                <Input
                  id='remarks'
                  placeholder='Remarks'
                  disabled={false}
                  onChange={changesetBillingRemarks}
                />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label='Evidence'>
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
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label='save' className='hideLabel'>
                <Button onClick={billingRemark}type='primary'>Save</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  )
}

export default BillingComment
