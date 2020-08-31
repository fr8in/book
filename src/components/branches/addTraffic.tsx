import React from 'react'
import {
  Modal,
  Button,
  Row,
  Form,
  Select,
  Table,
  Radio,
  Col
} from 'antd'
import { DeleteTwoTone } from '@ant-design/icons'
import TrafficMock from '../../../mock/card/cards'

const { Option } = Select
const AddTraffic = (props) => {
  const { visible, onHide, data, title } = props

  const onSubmit = () => {
    console.log('Traffic Added', data)
  }

  const Traffic = [
    {
      title: 'BM.Traffic',
      dataIndex: 'bmTraffic',
      render: (text, record) => <Radio>{text}</Radio>
    },
    {
      title: 'Phone',
      dataIndex: 'phone'
    },
    {
      title: 'Action',
      render: () => <DeleteTwoTone twoToneColor='#eb2f96' />
    }
  ]

  return (
    <Modal
      visible={visible}
      title={` ${title} Traffic`}
      onOk={onSubmit}
      onCancel={onHide}
      footer={[
        <Button onClick={onHide} key='back'>Close</Button>
      ]}
    >
      <Form>
        <Form.Item rules={[{ required: true }]}>
          <Row justify='start' className='m5' gutter={10}>
            <Col flex='auto'>
              <Select size='middle'>
                <Option value='Not Found'>Not Found</Option>
              </Select>
            </Col>
            <Col flex='100px'>
              <Button
                key='submit'
                type='primary'
                size='middle'
                onClick={onSubmit}
              >
                  Add Traffic
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
      <Table
        columns={Traffic}
        dataSource={TrafficMock}
        size='small'
        tableLayout='fixed'
        pagination={false}
      />
    </Modal>
  )
}

export default AddTraffic
