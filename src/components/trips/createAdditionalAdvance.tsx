import { useState } from 'react'
import { Row, Col, Radio, Form, Input, Button } from 'antd'

const CreateAdditionalAdvance = () => {
  const [radioValue, setRadioValue] = useState('WALLET')
  const onRadioChange = (e) => {
    setRadioValue(e.target.value)
  }
  return (
    <Row>
      <Col xs={24}>
        <Form layout='vertical'>
          <Row className='mb10'>
            <Col xs={24}>
              <Radio.Group
                onChange={onRadioChange}
                value={radioValue}
              >
                <Radio value='WALLET'>Wallet</Radio>
                <Radio value='BANK'>Any Account</Radio>
              </Radio.Group>
            </Col>
          </Row>
          {radioValue === 'BANK'
            ? (
              <div>
                <Row gutter={10}>
                  <Col xs={12} sm={8}>
                    <Form.Item label='Account Name'>
                      <Input
                        id='accountName'
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Form.Item label='Account Number'>
                      <Input
                        id='accountNumber'
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Form.Item label='Confirm Account Number'>
                      <Input
                        id='confirmAccountNumber'
                        required
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col xs={12} sm={8}>
                    <Form.Item label='IFSC Code'>
                      <Input
                        id='ifscCode'
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8} className='reduceMarginTop1'>
                    <Form.Item label='Amount'>
                      <Input
                        id='bankAmount'
                        required
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col xs={16}>
                    <Form.Item label='Bank Comment'>
                      <Input
                        id='bankComment'
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={8}>
                    <Form.Item label='save' className='hideLabel'>
                      <Button type='primary' disabled={false}>Pay to Bank </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </div>) : radioValue === 'WALLET'
              ? (
                <Row gutter={10}>
                  <Col xs={12} sm={8}>
                    <Form.Item label='Amount' extra='*Limit PO value'>
                      <Input
                        id='walletAmount'
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Row gutter={10}>
                      <Col xs={16}>
                        <Form.Item label='Comment'>
                          <Input
                            id='comment'
                            required
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={8}>
                        <Form.Item label='save' className='hideLabel'>
                          <Button type='primary' className='labelFix' disabled={false}>Pay Wallet</Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>) : null}
        </Form>
      </Col>
    </Row>
  )
}

export default CreateAdditionalAdvance
