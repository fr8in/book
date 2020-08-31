import { Modal, Button, Input, Row, Form, Space, message } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'

const UPDATE_PARTNER_BANK_MUTATION = gql`
mutation partnerBankEdit ($account_number:String,$ifsc_code:String,$acconnt_holder:String,$cardcode:String){
  update_partner(_set:{
    account_number: $account_number,
    ifsc_code: $ifsc_code,
    acconnt_holder:$acconnt_holder},
    where: {cardcode:{_eq:$cardcode}}){
    returning{
      id
      ifsc_code
    }
  }
}
`
const EditBank = (props) => {
  const { visible, onHide, cardcode } = props

  const [updatePartnerBank] = useMutation(
    UPDATE_PARTNER_BANK_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
  const onBankSubmit = (form) => {
    updatePartnerBank({
      variables: {
        cardcode: cardcode,
        account_number: form.account_number,
        ifsc_code: form.ifsc_code,
        acconnt_holder: form.acconnt_holder
      }
    })
  }

  return (
    <>
      <Modal
        title='Edit Bank'
        visible={visible}
        onCancel={onHide}
        footer={null}
      >
        <Form layout='vertical' onFinish={onBankSubmit}>
          <Form.Item
            name='acconnt_holder'
          >
            <Input placeholder='Name' />
          </Form.Item>
          <Form.Item
            name='account_number'
          >
            <Input placeholder=' Account Number' />
          </Form.Item>
          <Form.Item
            name='ifsc_code'
          >
            <Input placeholder=' IFSC Code' />
          </Form.Item>

          <Row justify='end'>
            <Space>
              <Button type='primary' icon={<LeftOutlined />} onClick={onHide}> Back </Button>
              <Button type='primary' key='back' htmlType='submit'> Save </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default EditBank
