import { Modal, Row, Button, Form, Input, Col, Select, DatePicker, Radio, Alert, Divider, Checkbox } from 'antd'
import { createPO, customer } from '../../../mock/customer/createQuickPo'
import Link from 'next/link'

const CustomerPo = (props) => {
  const { visible, onHide, truck_no, title } = props
  console.log('data', truck_no)

  const onSubmit = () => {
    console.log('Customer PO is Created!')
    onHide()
  }
  const onChange = (date, dateString) => {
    console.log(date, dateString)
  }

  const handlechange = (value) => {
    console.log(`Selected ${value}`)
  }

  const showSystemMamul = () => {
    console.log('sys.mamul!!')
  }

  return (
    <Modal
      visible={visible}
      title={`PO: ${title}`}
      onOk={onSubmit}
      onCancel={onHide}
      width={960}
      style={{ top: 20 }}
      footer={[
        <Button key='back' onClick={onHide}>Cancel</Button>,
        <Button key='OK' type='primary' onClick={onSubmit}>Create</Button>
      ]}
    >
      <Form layout='vertical' className='create-po'>
        <Link href='trucks/[id]' as={`trucks/${1}`}>
          <a className='truckPO'>{truck_no}</a>
        </Link>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item label='Customer'>
              <Select
                placeholder='Customer'
                onChange={handlechange}
                options={customer}
              />
              {props.error
                ? <Alert message={props.error} type='error' style={{ width: '100%' }} />
                : props.errorMessage &&
                  <Alert message={props.errorMessage} type='error' style={{ width: '100%' }} />}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col xs={12} sm={6}>
            <Form.Item label='PO Date'>
              <DatePicker onChange={onChange} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item label='Loading Point Contact'>
              <Input
                placeholder='loading Point Contact'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item label='Source'>
              <Select
                onChange={handlechange}
                options={createPO}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item label='Destination'>
              <Select
                onChange={handlechange}
                options={createPO}
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider className='hidden-xs' />
        <Row gutter={10}>
          <Col xs={24} sm={6}>
            <Form.Item>
              <Radio.Group defaultValue='Rate/Trip' onChange={handlechange}>
                <Radio value='Rate/Trip'>Rate/Trip</Radio>
                <Radio value='Rate/Ton'>Rate/Ton</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Row gutter={10}>
              <Col xs={12}>
                <Form.Item>
                  <Input
                    placeholder='Price'
                    disabled={false}
                    addonBefore='₹'
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item>
                  <Input
                    placeholder='Ton'
                    disabled={false}
                    addonAfter='Ton'
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={11} sm={5}>
            <Form.Item label='Customer Price' extra={`Advance% ${90}`}>
              <Input
                placeholder='customerPrice'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={1}>
            <Form.Item label='-' className='hideLabel text-center'>
              <span>-</span>
            </Form.Item>
          </Col>
          <Col xs={12} sm={5}>
            <Form.Item label='Mamul Charge' extra={<span>System Mamul: <span className='link' onClick={showSystemMamul}>400</span></span>}>
              <Input
                placeholder='0'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={1}>
            <Form.Item label='=' className='hideLabel text-center hidden-xs'>
              <span>=</span>
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} className='hidden-xs'>
            <Form.Item label='Net Price'>
              <Input
                placeholder='Net Price'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item label='Including'>
              <Checkbox>Loading</Checkbox>
              <Checkbox>Unloading</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Divider className='hidden-xs' />
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Row gutter={10}>
              <Col xs={12}>
                <Form.Item label='Bank'>
                  <Input
                    placeholder='Bank'
                    disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item label='Cash'>
                  <Input
                    placeholder='Cash'
                    disabled={false}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={12}>
            <Row gutter={10}>
              <Col xs={12}>
                <Form.Item label='To-price'>
                  <Input
                    placeholder='To-Price'
                    disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item label='Driver Number'>
                  <Input
                    placeholder='Driver Number'
                    disabled={false}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={8} sm={5}>Partner₹: {30000}</Col>
          <Col xs={8} sm={5}>Adv-70%: {21000}</Col>
          <Col xs={8} sm={5}>Wallet: {21000}</Col>
          <Col xs={8} sm={5}>Cash: {0}</Col>
          <Col xs={8} sm={4}>To-Pay: {0}</Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CustomerPo
