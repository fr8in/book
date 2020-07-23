import { Row, Col, Card, Form, DatePicker, Tooltip, Input, Space, Button, Checkbox } from 'antd'
import {
  FilePdfOutlined,
  FileWordOutlined,
  DownloadOutlined,
  MailOutlined,
  DeleteOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import LoadingMemo from './loadingMemo'
import useShowHide from '../../hooks/useShowHide'

const TripTime = () => {
  const initial = { checkbox: false, mail: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  return (
    <Card size='small' className='mt10'>
      <Row>
        <Col xs={24}>
          <Form layout='vertical'>
            <Row gutter={10}>
              <Col xs={8}>
                <Form.Item label='Source In'>
                  <DatePicker
                    showTime
                    format='DD-MMM-YYYY HH:mm'
                    placeholder='Select Time'
                    style={{ width: '100%' }}
                    disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label='Source Out'>
                  <Tooltip title='Stop! Ask partner to upload LR'>
                    <DatePicker
                      showTime
                      format='DD-MMM-YYYY HH:mm'
                      placeholder='Select Time'
                      style={{ width: '100%' }}
                      disabled={false}
                    />
                  </Tooltip>
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label='Driver Phone'>
                  <Tooltip
                    trigger={['hover']}
                    title='Enter 10 digit mobile number starting with 6 to 9'
                    placement='top'
                    overlayClassName='numeric-input'
                  >
                    <Input
                      id='driverNumber'
                      placeholder='Enter Driver Number'
                      maxLength={10}
                      disabled={false}
                    />
                  </Tooltip>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col xs={8}>
                <Form.Item label='Destination In'>
                  <DatePicker
                    showTime
                    format='DD-MMM-YYYY HH:mm'
                    placeholder='Select Time'
                    style={{ width: '100%' }}
                    disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label='Destination Out'>
                  <DatePicker
                    showTime
                    format='DD-MMM-YYYY HH:mm'
                    placeholder='Select Time'
                    style={{ width: '100%' }}
                    disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label='Loading Memo'>
                  <Space>
                    <Button type='primary' shape='circle' icon={<FilePdfOutlined />} />
                    <Button type='primary' shape='circle' icon={<FileWordOutlined />} />
                    <Button shape='circle' icon={<MailOutlined />} onClick={() => onShow('mail')} />
                  </Space>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col xs={8}>
                <Form.Item label='To-Pay Amount'>
                  <Input
                    id='toPay'
                    placeholder='To Pay Amount'
                    type='number'
                    disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={16}>
                <Form.Item label='To-Pay Comment'>
                  <Input
                    id='toPayComment'
                    placeholder='To Pay Comment'
                    disabled={false}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className='mb15'>
              <Col xs={20}>
                <Checkbox checked disabled={false}>Unloaded at private godown</Checkbox>
              </Col>
              <Col xs={4} className='text-right'>
                <Tooltip title='Warehouse Receipt'>
                  <Button size='small' type='primary' shape='circle' icon={<DownloadOutlined />} />
                </Tooltip>
              </Col>
            </Row>
            <Row>
              <Col xs={16}>
                <Space>
                  <Button type='primary' danger icon={<DeleteOutlined />}>PO</Button>
                  <Button type='primary'>Process Advance</Button>
                  <Button danger icon={<CloseCircleOutlined />}>Sout</Button>
                  <Button danger icon={<CloseCircleOutlined />}>Dout</Button>
                </Space>
              </Col>
              <Col xs={8} className='text-right'>
                <Space>
                  <Button>Cancel</Button>
                  <Button type='primary'>Submit</Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      {visible.mail && <LoadingMemo visible={visible.mail} onHide={() => onHide('mail')} />}
    </Card>

  )
}

export default TripTime
