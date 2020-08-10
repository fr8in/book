import { Modal, Button, Row, Col, Form, Input,message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import {useState} from "react";

const CUSTOMER_MUTATION = gql`
mutation insertTripPrice($trip_id:Int,$customer_price:Float,$customer_advance_percentage:Int,$mamul:Float,$bank:Float,$cash:Float,$to_pay:Float,$comment:String,$partner_price:Float){
  insert_trip_price(objects:{
    trip_id: $trip_id,
    customer_price: $customer_price, 
    mamul: $mamul, 
    bank: $bank, 
    cash: $cash, 
    to_pay: $to_pay,
    comment: $comment,
    customer_advance_percentage:$customer_advance_percentage,
    partner_price: $partner_price
  }){
    returning{
      id
    }
  }
}
`

const CustomerPrice = (props) => {

  const { visible, onHide,trip_price ,trip_id} = props
  
  console.log('trip_price',trip_price)

  const [Customer_Price, setCustomer_Price] = useState('')
  const [Mamul, setMamul] = useState('')
  const [Bank, setBank] = useState('')
  const [Cash, setCash] = useState('')
  const [ToPay, setToPay] = useState('')
  const [Comment, setComment] = useState('')
  
  const handlecustomerPrice = (e) => {
    setCustomer_Price(e.target.value)
  }
  console.log('Customer_Price', Customer_Price)

  const handlemamul = (e) => {
    setMamul(e.target.value)
  }
  console.log('Mamul', Mamul)

  const handlebank = (e) => {
    setBank(e.target.value)
  }
  console.log('Bank', Bank)

  const handlecash = (e) => {
    setCash(e.target.value)
  }
  console.log('Cash', Cash)
  const handletoPay = (e) => {
    setToPay(e.target.value)
  }
  console.log('ToPay', ToPay)
  const handlecomment = (e) => {
    setComment(e.target.value)
  }
  console.log('Comment', Comment)

  const [insertTripPrice] = useMutation(
    CUSTOMER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const Customer = () => {
    console.log('trip_id',trip_id)
    insertTripPrice({
      variables: {
        trip_id:trip_id,
        customer_price:Customer_Price, 
        mamul: Mamul, 
        bank:Bank, 
        cash: Cash, 
        to_pay: ToPay,
        comment: Comment,
        partner_price: trip_price.partner_price,
        customer_advance_percentage:trip_price.customer_advance_percentage
      }
    })
  }

  const changePrice = Math.ceil((trip_price.customer_price/100) *trip_price.customer_advance_percentage)
  const advance = Math.ceil(trip_price.customer_price-changePrice)

  return (
    
      <Modal
        title={`Customer Price Change - Advance (${trip_price.customer_advance_percentage}%): ${advance}`}
        visible={visible}
        onCancel={onHide}
        footer={[
          <Button key='back'>Cancel</Button>,
          <Button type='primary'  onClick={Customer} key='update'>Update</Button>
        ]}
      >
        <Form layout='vertical'>
          <Row gutter={10}>
            <Col sm={12}>
              <Form.Item
                label='Customer Price'
                name='Customer Price'
                rules={[{ required: true, message: 'Customer Price is required field!' }]}
                initialValue={trip_price.customer_price}
              >
                <Input onChange={handlecustomerPrice} />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                label='Mamul Charge'
                initialValue={trip_price.mamul}
              >
                <Input onChange={handlemamul} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col sm={8}>
              <Form.Item
                label='Bank'
                name='Bank'
                rules={[{ required: true, message: 'Bank value is required field!' }]}
                initialValue={trip_price.bank}
              >
                <Input  onChange={handlebank}/>
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item
                label='Cash'
                name='Cash'
                rules={[{ required: true, message: 'Cash is required field!' }]}
                initialValue={trip_price.cash}
              >
                <Input  onChange={handlecash}/>
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item
                label='To-Pay'
                name='To-Pay'
                rules={[{ required: true, message: 'To-Pay is required field!' }]}
                initialValue={trip_price.to_pay}
              >
                <Input onChange={handletoPay} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col sm={24}>
              <Form.Item
                label='Comment'
                name='Comment'
                rules={[{ required: true, message: 'Comment value is required field!' }]}
              >
                <Input placeholder='Comment' onChange={handlecomment} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <h4>  Partner Price : {trip_price.partner_price} </h4>
          </Row>
        </Form>
      </Modal>
   
  )
}

export default CustomerPrice
