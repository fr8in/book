import { Row, Col, Radio, Input, Select, Form, Button } from 'antd'

const issueTypeList = [{ label: 'null', value: 1 }]
const CreditNote = () => {
  return (
    <>
      <Row className='mb10'>
        <Radio.Group
          className='radioGroup1' defaultValue='Credit Note'
          onChange={(e) => this.setState({ radioType: e.target.value })}
        >
          <Radio value='Credit Note'>Credit</Radio>
          <Radio value='Debit Note'>Debit</Radio>
        </Radio.Group>
      </Row>
      <Form layout='vertical'>
        <Row gutter={10}>
          <Col xs={{ span: 24 }} sm={{ span: 12 }}>
            <Form.Item label='Amount'>
              <Input
                id='amount'
                maxLength={5}
                required
              />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }}>
            <Form.Item label='Issue Type'>
              <Select
                id='issueType'
                placeholder='Select Issue Type'
                options={issueTypeList}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col flex='auto'>
            <Form.Item label='Comment'>
              <Input
                id='comment'
                type='textarea'
                required
                name='comment'
              />
            </Form.Item>
          </Col>
          <Col flex='90px'>
            <Form.Item label='save' className='hideLabel'>
              <Button type='primary'>Submit</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default CreditNote
