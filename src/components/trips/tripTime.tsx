import { Row, Col, Card, Form, DatePicker, Tooltip, Input, Space, Button, Checkbox } from 'antd'
import {
  FilePdfOutlined,
  FileWordOutlined,
  DownloadOutlined,
  MailOutlined,
  DeleteOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import SendLoadingMemo from './sendLoadingMemo'
import useShowHide from '../../hooks/useShowHide'
import DeletePO from './deletePO'
import DriverPhoneNo from './driverPhoneNo'
import SourceInDate from './tripSourceIn'
import SourceOutDate from './tripSourceOut'
import DestinationInDate from './tripDestinationIn'
import DestinationOutDate from './tripDestinationOut'

const TripTime = (props) => {
  const { tripInfo } = props
  console.log('tripInfo', tripInfo)
  const initial = { checkbox: false, mail: false, deletePO: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  return (
    <Card size='small' className='mt10'>
      <Row>
        <Col xs={24}>
          <Form layout='vertical'>
            <Row gutter={10}>
              <Col xs={8}>
                <SourceInDate source_in={tripInfo.source_in} id={tripInfo.id} />
              </Col>
              <Col xs={8}>
              <SourceOutDate source_out={tripInfo.source_out} id={tripInfo.id} />
              </Col>
              <DriverPhoneNo />
            </Row>
            <Row gutter={10}>
              <Col xs={8}>
              <DestinationInDate destination_in={tripInfo.destination_in} id={tripInfo.id} />
              </Col>
              <Col xs={8}>
              <DestinationOutDate destination_out={tripInfo.destination_out} id={tripInfo.id} />
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
                  <Button type='primary' danger icon={<DeleteOutlined />} onClick={() => onShow('deletePO')}>PO</Button>
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
      {visible.mail && <SendLoadingMemo visible={visible.mail} onHide={onHide} />}
      {visible.deletePO && <DeletePO visible={visible.deletePO} onHide={onHide} />}
    </Card>

  )
}

export default TripTime
