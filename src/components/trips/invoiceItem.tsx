import { useState } from 'react'
import { Row, Col, Checkbox, Form, Input } from 'antd'

const InvoiceItem = (props) => {
  const [checked, setChecked] = useState(false)
  const onChange = e => {
    setChecked(e.target.checked)
  }
  return (
    <Row gutter={6} className='item'>
      <Col flex='auto'>
        {props.checkbox &&
          <b><Checkbox checked={checked} onChange={onChange} disabled={false} /></b>}
        <label>{props.itemName}</label>
        {props.dayInput &&
          <Form.Item>
            <Input
              id={props.ldId}
              disabled={false}
              type='number'
              size='small'
            />
          </Form.Item>}
        {props.splHalting && checked &&
          <Row className='mt10'>
            <Col xs={24}>
              <label>{props.splHalting}</label>
            </Col>
          </Row>}
      </Col>
      <Col flex='100px' className='text-right'>
        {props.amount
          ? <p>{props.amount}</p>
          : <Input id={props.fId} type='number' disabled={false} size='small' />}
        {props.splHalting && checked &&
          <Row className='mt10'>
            <Col xs={24}>
              <Input
                id={props.splId}
                type='number'
                disabled={false}
                size='small'
              />
            </Col>
          </Row>}
      </Col>
    </Row>
  )
}

export default InvoiceItem
