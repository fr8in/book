import { Modal, Button, Input,Col ,message} from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'

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
  const [acconnt_holder, setacconnt_holder] = useState('')
  const [account_number, setaccount_number] = useState('')
  const [ifsc_code, setifsc_code] = useState('')
  const [updatePartnerBank] = useMutation(
    UPDATE_PARTNER_BANK_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const nameChange = (e) => {
    setacconnt_holder(e.target.value)
  }
  const account_numberChange = (e) => {
    setaccount_number(e.target.value)
  }
  const ifsc_codeChange = (e) => {
    setifsc_code(e.target.value)
  }
  const onSubmit = () => {
    updatePartnerBank({
      variables: {
        cardcode:cardcode,
        account_number:account_number,
        ifsc_code:ifsc_code,
        acconnt_holder: acconnt_holder
      }
    })
  }
  
  
  return (
    <>
      <Modal
        title='Edit Bank'
        visible={visible}
        onCancel={onHide}
        footer={[
          <Button type='primary'icon={<LeftOutlined/>} > Back </Button>,
          <Button  type='primary' onClick={onSubmit}> Save </Button>
        ]}
      >
       <Col sm={20}><Input onChange={nameChange} placeholder="Name" /></Col>
       <br />
       <Col sm={20}><Input onChange={account_numberChange} placeholder="Account Number" /></Col>
       <br />
       <Col sm={20}><Input onChange={ifsc_codeChange} placeholder="IFSC Code" /></Col>    
      </Modal>
    </>
  )
}

export default EditBank