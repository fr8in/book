import React from 'react'
import {
  Modal,
  Button,
  Row,
  Form,
  Select,
  Input,
  Radio,
  Col,
  List,
  Checkbox,
  Space,
  Table
} from 'antd'
import { DeleteTwoTone, EyeTwoTone, UploadOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Option } = Select
const tableData = [
  { truck_no: 'TN03AA0001', type: 'MXL' },
  { truck_no: 'TN03AA0002', type: 'SXL' }
]
const KycApproval = (props) => {
  const { visible, onHide, data } = props

  const onSubmit = () => {
    console.log('KYC Approved', data)
    onHide()
  }

  const column = [
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      render: (text, record) => {
        return (
          <Link href='/trucks/[id]' as={`trucks/${record.truck_no}`}>
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'Type',
      dataIndex: 'type'
    }
  ]

  return (
    <Modal
      visible={visible}
      title='KYC Approval'
      onOk={onSubmit}
      onCancel={onHide}
      style={{ top: 10 }}
      bodyStyle={{ padding: 10 }}
      width={700}
      footer={[
        <Button key='back' onClick={onHide}>
            Close
        </Button>,
        <Button key='submit' type='primary' onClick={onSubmit}>
            Approve KYC
        </Button>
      ]}
    >
      <Form layout='vertical'>
        <Row gutter={10}>
          <Col xs={24} sm={10}>
            <Form.Item name='partnerName' label='Partner Name'>
              <Link href='/partners/[id]' as={`/partners/${data.cardcode}`}><a>{data.name}</a></Link>
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item name='advancePercentage' label='Advance Percentage'>
              <Select placeholder='Select Percentage' allowClear>
                <Option value='Not Found'>Not Found</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name='On-Boarded By'
              label='On-Boarded By'
              rules={[{ required: true }]}
            >
              <Select placeholder='Select Name' allowClear>
                <Option value='Not Found'>Not Found</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <List header={<label>Documents</label>} bordered size='small' className='mb10'>
          <List.Item>
            <Col xs={24} sm={8}>PAN Document</Col>
            <Col xs={12} sm={12}>{data.pan}</Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
                <Button
                  type='primary'
                  shape='circle'
                  size='middle'
                  icon={<EyeTwoTone />}
                />
                <Button
                  size='middle'
                  shape='circle'
                  icon={<DeleteTwoTone twoToneColor='#eb2f96' />}
                />
              </Space>
            </Col>
          </List.Item>
          <List.Item>
            <Col xs={24} sm={8}>Cheque/Passbook</Col>
            <Col xs={12} sm={12}>{data.accNo}</Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
                <Button
                  type='primary'
                  shape='circle'
                  size='middle'
                  icon={<EyeTwoTone />}
                />
                <Button
                  size='middle'
                  shape='circle'
                  icon={<DeleteTwoTone twoToneColor='#eb2f96' />}
                />
              </Space>
            </Col>
          </List.Item>
          <List.Item>
            <Col xs={24} sm={8}>Agreement</Col>
            <Col xs={12} sm={12}>&nbsp;</Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
                <Button
                  type='primary'
                  shape='circle'
                  size='middle'
                  icon={<EyeTwoTone />}
                />
                <Button
                  size='middle'
                  shape='circle'
                  icon={<DeleteTwoTone twoToneColor='#eb2f96' />}
                />
              </Space>
            </Col>
          </List.Item>
          <List.Item>
            <Col xs={24} sm={8}>Cibil Score</Col>
            <Col xs={12} sm={12}><Input placeholder='Cibil Score' /></Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
                <Button
                  type='primary'
                  shape='circle'
                  size='middle'
                  icon={<EyeTwoTone />}
                />
                <Button
                  size='middle'
                  shape='circle'
                  icon={<DeleteTwoTone twoToneColor='#eb2f96' />}
                />
              </Space>
            </Col>
          </List.Item>
          <List.Item>
            <Col xs={24} sm={8}>TDS</Col>
            <Col xs={12} sm={12}>
              <Radio.Group>
                <Radio value='Applicable'>Applicable</Radio>
                <Radio value='notApplicable'>Not Applicable</Radio>
              </Radio.Group>
            </Col>
            <Col xs={12} sm={4} className='text-right'>
              <Button size='middle' shape='circle' icon={<UploadOutlined />} />
            </Col>
          </List.Item>
          <List.Item>
            <Col xs={24} sm={8}>GST Applicable</Col>
            <Col xs={12} sm={12}>
              <Input placeholder='GST Number' />
            </Col>
            <Col xs={12} sm={4} className='text-right'>&nbsp;</Col>
          </List.Item>
          <List.Item>
            <Col xs={24} sm={8}>
              <Checkbox>EMI</Checkbox>
            </Col>
            <Col xs={12} sm={12}>&nbsp;</Col>
            <Col xs={12} sm={4} className='text-right'>&nbsp;</Col>
          </List.Item>
        </List>
        <Table
          columns={column}
          dataSource={tableData}
          size='small'
          pagination={false}
        />
      </Form>
    </Modal>
  )
}

export default KycApproval
