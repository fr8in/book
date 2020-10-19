import { Row, Col, Checkbox, Form, Input } from 'antd'

const InvoiceItem = (props) => {
  const { item_label, halting_label, amount, value, checkbox, dayInput, days_name, field_name, spl_name, form, disable, checked, setChecked } = props

  const onChange = e => {
    setChecked(e.target.checked)
    if (form) {
      form.resetFields(e.target.checked ? [days_name] : [spl_name, field_name])
    }
  }
  const disable_field = checkbox && !checked
  return (
    <Row gutter={6} className='item'>
      <Col flex='auto'>
        {checkbox &&
          <b><Checkbox checked={checked} onChange={onChange} disabled={disable} /></b>}
        <label>{item_label}</label>
        {dayInput &&
          <Form.Item name={days_name}>
            <Input
              disabled={!disable_field || disable}
              placeholder='Days'
              type='number'
              min='0'
              size='small'
            />
          </Form.Item>}
        {halting_label && checked &&
          <Row className='mt10'>
            <Col xs={24}>
              <label>{halting_label}</label>
            </Col>
          </Row>}
      </Col>
      <Col flex='100px' className='text-right'>
        {amount ? <p>{value || 0}</p>
          : (
            <Form.Item name={field_name}>
              <Input
                placeholder='Amount'
                type='number'
                min='0'
                step='any'
                disabled={disable_field || disable}
                size='small'
                className='text-right'
              />
            </Form.Item>
          )}
        {halting_label && checked &&
          <Row className='mt10'>
            <Col flex='100px'>
              <Form.Item name={spl_name}>
                <Input
                  placeholder='Amount'
                  type='number'
                  min='0'
                  disabled={disable}
                  size='small'
                  className='text-right'
                />
              </Form.Item>
            </Col>
          </Row>}
      </Col>
    </Row>
  )
}

export default InvoiceItem
