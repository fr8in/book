import React from 'react'
import { Modal, Button, Input, message, Form, Row, Col } from 'antd'
import { gql, useMutation } from '@apollo/client'

const Account_Statement = gql`
mutation customer_Account_mail( $cardcode:String!,$emails:[String!]) {
  report_customer_mail(emails: $emails, customer_code: $cardcode) {
    description
    status
  }
}`

const ReportEmail = (props) => {
  const { visible, onHide, cardcode } = props
  
  const [account_Report] = useMutation(
    Account_Statement,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Sent!!') 
      onHide()
    }  
    }
  )

  const onSubmit = (form) => {
    account_Report({
      variables: {
        cardcode: cardcode,
        emails: form.email
      }
    })
  }
  return (
    <Modal
      title='Account Statement'
      visible={visible}
      onCancel={onHide}
      footer={null}
    >
      <Form onFinish={onSubmit} >
        <Form.Item name='email'>
          <Row gutter={10}>
            <Col flex='auto'>
              <Input placeholder='Your Email Address...' />
            </Col>
            <Col flex='100px'>
              <Button
                type='primary'
                htmlType='submit'
              >
                Send Email
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ReportEmail