
import { Row, Col, Form, Input, Button ,message} from 'antd'
import { gql, useMutation } from '@apollo/client'
import {useState} from "react";


const UPDATE_TRUCK_INFO_MUTATION = gql`
mutation TruckInfo($length:Int,$breadth:Int,$height:Int,$id:Int) {
  update_truck(_set: {length:$length,breadth:$breadth,height:$height}, where: {id: {_eq:$id }}){
    returning{
      id
      length
      breadth
      height
    }
  }
}
`

const TruckInfo = (props) => {
  const {truck_info,id} = props

  const [length, setlength] = useState('')
  const [breadth, setbreadth] = useState('')
  const [height, setheight] = useState('')

  const [updateTruckInfo] = useMutation(
    UPDATE_TRUCK_INFO_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  const lengthChange = (e) => {
    setlength(e.target.value)
  }

  const breadthChange = (e) => {
    setbreadth(e.target.value)
  }

  const heightChange = (e) => {
    setheight(e.target.value)
  }

  const onSubmit = () => {
   console.log("id",id)
   updateTruckInfo({
    variables: {
      id : id,
    length : length ,
    breadth : breadth,
    height : height,
    }
  })
  }
  
  return (
    <Form layout='vertical'>
      <Row gutter={10}>
        <Col span={5}>
        
          <Form.Item
            label='Length(Ft)'
            name='Length(Ft)'
            rules={[{ required: true, message: 'Length(Ft) is required field' }]}  
            initialValue={truck_info.length}
          >
            <Input
              type='number'
              placeholder='Length(Ft)'
              disabled={false}
            onChange={lengthChange}
            />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            label='Breadth(Ft)'
            name='Breadth(Ft)'
            rules={[{ required: true, message: 'Breadth(Ft) is required field' }]}
            initialValue={truck_info.breadth}
          >
            <Input
              type='number'
              placeholder='Breadth(Ft)'
              disabled={false}
              onChange={breadthChange}
            />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            label='Height(Ft)'
            name='Height(Ft)'
            rules={[{ required: true, message: 'Height(Ft) is required field' }]}
            initialValue={truck_info.height }
          >
            <Input placeholder='Height(Ft)'
             type='number'
              disabled={false}
              onChange={heightChange}
              />
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item label='save' name='save' className='hideLabel'>
        <Button  type="primary" onClick={onSubmit}> Save </Button>
        </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label='Driver'
            name='Driver'
            rules={[{ required: true, message: 'Driver Number is required field' }]}
          >
            <Input placeholder='Driver Number' />
          </Form.Item>
        </Col>
      </Row>
    </Form>
   
  )
}

export default TruckInfo
