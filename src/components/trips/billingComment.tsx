import { Row, Col, Form, Input, Button, message, Divider } from 'antd'
import { gql, useMutation } from '@apollo/client'
import FileUpload from '../common/fileUpload'
import get from 'lodash/get'
import { useState } from 'react'

const BILLING_COMMENT_MUTATION = gql`
mutation update_billing_comment($id: Int!, $billing_remarks: String){
  update_trip(_set: {billing_remarks: $billing_remarks}, where: {id: {_eq:$id}}) {
    returning {
      billing_remarks
    }
  }
}
`

const BillingComment = (props) => {
  const { trip_id, trip_info } = props

  const [disableButton, setDisableButton] = useState(false)

  const [billingRemarks] = useMutation(
    BILLING_COMMENT_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString()) },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!') }
    }
  )

  const billingRemark = (form) => {
    setDisableButton(true)
    console.log('form', form)
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
  const trip_status_id = get(trip_info, 'trip_status.id', null)
  const trip_status = (trip_status_id >= 12)
  console.log('trip_info', trip_info)
  return (
    <Row>
      <Col xs={24}>
        <Form layout='vertical' onFinish={billingRemark}>
          <Row gutter={10}>
            <Col xs={24} sm={6}>
              <h4>Evidence</h4>
              <FileUpload
                id={trip_id}
                type='trip'
                folder='approvals/'
                file_type='EVIDENCELIST'
                file_list={evidence_file_list}
                disable={trip_status}
              />
            </Col>
            <Col xs={24} sm={18}>
              <Row gutter={10}>
                <Col flex='auto'>
                  <Form.Item label='Remarks' name='billing_remarks' rules={[{ required: true }]}>
                    <Input
                      id='remarks'
                      placeholder='Remarks'
                      disabled={trip_status}
                    />
                  </Form.Item>
                </Col>
                <Col flex='80px'>
                  <Form.Item label='save' className='hideLabel'>
                    <Button htmlType='submit' type='primary' loading={disableButton} disabled={trip_status}>Save</Button>
                  </Form.Item>
                </Col>
              </Row>
              {trip_info.billing_remarks &&
                <Row>
                  <Col xs={24}>
                    <label>Billing Remark</label>
                    <Divider />
                    <p>{trip_info.billing_remarks}</p>
                  </Col>
                </Row>}
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  )
}

export default BillingComment
