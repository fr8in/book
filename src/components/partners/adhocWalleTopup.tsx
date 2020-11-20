import { useState, useContext } from 'react'
import { Modal, Input, Button,Form} from 'antd'
import _ from 'lodash'
import userContext from '../../lib/userContaxt'

const AdhocwalletTopup = (props) => {
  const { visible, onHide, partner_id } = props

  const [selectedTopUps, setSelectedTopUps] = useState(true)
  const [total, setTotal] = useState(0)
  const context = useContext(userContext)

  const discount = selectedTopUps ? total * 2 / 100 : 0
  const net_topup = total - discount

  return (
    <Modal
      title='Wallet Top Up'
      visible={visible}
      onCancel={onHide}
      width={900}
      bodyStyle={{ padding: 20 }}
      style={{ top: 20 }}
      footer={[]}
    >
      <Form layout='vertical'>
        <Form.Item label='Amount' name='amount' rules={[{ required: true }]}>
          <Input type='number' placeholder='Amount' />
        </Form.Item>
        <Form.Item label='Comment'  rules={[{ required: true }]}>
          <Input  placeholder='Enter the Comment' />
        </Form.Item>
        <Form.Item className='text-right'>
          <Button type='primary' htmlType='submit'>Pay to Bank</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AdhocwalletTopup
