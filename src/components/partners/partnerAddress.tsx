import { Modal, Button, Input,Col,message } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import {useState} from 'react'

const UPDATE_PARTNER_ADDRESS_MUTATION = gql`
mutation address_update($address:jsonb, $cardcode:String){
  update_partner(_set:{address: $address} where: {cardcode:{_eq:$cardcode}}){
    returning{
      id
      address
    }
  }
}
`
const EditAddress = (props) => {
  const { visible, onHide, cardcode } = props
  const initialAddress ={ 
    no:null,
    address:null,
    city:null,
    state: null,
    pincode:null
  }
  const [address,setAddress] =useState(initialAddress)
  const [updatePartnerAddress] = useMutation(
    UPDATE_PARTNER_ADDRESS_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onBuildingNoChange = (e) => {
    setAddress({ ...address, no: e.target.value });
  };

  const onAddressChange = (e) => {
    setAddress({ ...address, address: e.target.value });
  };

  const onCityChange = (e) => {
    setAddress({ ...address, city: e.target.value });
  };

  const onStateChange = (e) => {
    setAddress({ ...address, state: e.target.value });
  };
  const onPincodeChange = (e) => {
    setAddress({ ...address, pincode: e.target.value });
  };

  const onSubmit = () => {
    updatePartnerAddress({
      variables: {
        cardcode:cardcode,
        address:address
      }
    })
  }
  console.log('cardcode',cardcode)
  
  return (
    <>
      <Modal
        title='Edit Address'
        visible={visible}
        onCancel={onHide}
        footer={[
          <Button type='primary'icon={<LeftOutlined/>} > Back </Button>,
          <Button  type='primary' onClick={onSubmit}> Save </Button>
        ]}
      >
          <Col sm={20}><Input onChange={onBuildingNoChange} placeholder="Building Number" /></Col>
          <br />
          <Col sm={20}><Input onChange={onAddressChange} placeholder="Address" /></Col>
          <br />
          <Col sm={20}> <Input onChange={onCityChange} placeholder="City" /> </Col>
          <br />          
          <Col sm={20}> <Input onChange={onStateChange} placeholder="State" /> </Col>        
          <br />
          <Col sm={20}> <Input onChange={onPincodeChange} placeholder="Pin Code" /> </Col>
      </Modal>
    </>
  )
}

export default EditAddress