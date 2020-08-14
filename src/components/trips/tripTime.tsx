import { Row, Col, Card, Form, Tooltip, Input, Space, Button, Checkbox, message } from 'antd'
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
import GodownReceipt from './godownReceipt'
import Driver from './driver'
import SourceInDate from './tripSourceIn'
import SourceOutDate from './tripSourceOut'
import DestinationInDate from './tripDestinationIn'
import DestinationOutDate from './tripDestinationOut'
import { gql, useMutation } from '@apollo/client'

const REMOVE_SOUT_MUTATION = gql`
mutation removeSouceOut($source_out:timestamptz,$id:Int!) {
  update_trip(_set: {source_out: $source_out}, where: {id: {_eq: $id}}) {
    returning {
      id
      source_out
    }
  }
}
`

const REMOVE_DOUT_MUTATION = gql`
mutation removeDestinationOut($destination_out:timestamptz,$id:Int!) {
  update_trip(_set: {destination_out: $destination_out}, where: {id: {_eq: $id}}) {
    returning {
      id
      destination_out
    }
  }
}
`
const TO_PAY_MUTATION = gql`
mutation insertToPay($to_pay: Float, $comment: String, $trip_id: Int!) {
  insert_trip_price(objects: {to_pay: $to_pay, comment:$comment, trip_id: $trip_id}) {
    returning {
      to_pay
      comment
    }
  }
}
`

const TripTime = (props) => {

  const { trip_info,trip_id} = props
  console.log('trip_info', trip_info)
  const initial = { checkbox: false, mail: false, deletePO: false,godownReceipt:false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const [removeSout] = useMutation(
    REMOVE_SOUT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const [removeDout] = useMutation(
    REMOVE_DOUT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const [insertTopay] = useMutation(
    TO_PAY_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSoutRemove = () => {
    removeSout({
      variables: {
        id: trip_info.id,
        source_out: null
      }
    })
  }
  const onDoutRemove = () => {
    removeDout({
      variables: {
        id: trip_info.id,
        destination_out: null
      }
    })
  }
  const getToPay = (form) => {
    console.log('form', form)
    insertTopay({
      variables: {
        to_pay: form.to_pay,
        comment:form.comment ,
        trip_id: trip_info.id
      }
    })
  }

  const authorized = true // TODO
  const po_delete = (trip_info.trip_status &&
                    trip_info.trip_status.name === 'Assigned' &&
                    trip_info.trip_status.name === 'Confirmed' &&
                    trip_info.trip_status.name === 'Reported at source') &&
                    !trip_info.source_out
  const process_advance = trip_info.source_in && !trip_info.source_out // &&  trip_info.loaded = 'No'
  const remove_sout = trip_info.trip_status && trip_info.trip_status.name === 'Intransit' && authorized
  const remove_dout = trip_info.trip_status && trip_info.trip_status.name === 'Delivered' && authorized

  const toPayValue= trip_info && trip_info.trip_prices && trip_info.trip_prices.length > 0 && trip_info.trip_prices[0].to_pay > 0  ? true : false
  console.log('checking',toPayValue)
  const toPayCheck= trip_info && trip_info.trip_prices && trip_info.trip_prices.length > 0 && trip_info.trip_prices[0].to_pay === 0  ? true : false
  console.log('toPayCheck',toPayCheck)

  return (
    <Card size='small' className='mt10'>
      <Row>
        <Col xs={24}>
          <Form layout='vertical' onFinish={getToPay}>
            <Row gutter={10}>
              <Col xs={8}>
                <SourceInDate source_in={trip_info.source_in} id={trip_info.id} />
              </Col>
              <Col xs={8}>
                <SourceOutDate source_out={trip_info.source_out} id={trip_info.id} />
              </Col>
              <Col xs={8}>
                <Driver trip_info={trip_info} />
              </Col>
            </Row>
            <Row gutter={10}>
              <Col xs={8}>
                <DestinationInDate destination_in={trip_info.destination_in} id={trip_info.id} />
              </Col>
              <Col xs={8}>
                <DestinationOutDate destination_out={trip_info.destination_out} id={trip_info.id} />
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
                <Form.Item label='To-Pay Amount' name='to_pay'>
                  <Input
                    id='toPay'
                    placeholder='To Pay Amount'
                    type='number'
                    disabled={toPayCheck}
                    required={toPayValue}
                  />
                </Form.Item>
              </Col>
              <Col xs={16}>
                <Form.Item label='To-Pay Comment' name='comment'>
                  <Input
                    id='comment'
                    placeholder='To Pay Comment'
                    disabled={toPayCheck}
                    required={toPayValue}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className='mb15'>
              <Col xs={20}>
                <Checkbox disabled={false}  onClick={() => onShow('godownReceipt')}>Unloaded at private godown</Checkbox>
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
                  {po_delete &&
                    <Button type='primary' danger icon={<DeleteOutlined />} onClick={() => onShow('deletePO')}>PO</Button>}
                  {process_advance &&
                    <Button type='primary'>Process Advance</Button>}
                  {remove_sout &&
                    <Button danger icon={<CloseCircleOutlined />} onClick={onSoutRemove}>Sout</Button>}
                  {remove_dout &&
                    <Button danger icon={<CloseCircleOutlined />} onClick={onDoutRemove}>Dout</Button>}
                </Space>
              </Col>
              <Col xs={8} className='text-right'>
                <Button type='primary'  htmlType='submit'  disabled={toPayCheck}  >Submit</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      {visible.mail && <SendLoadingMemo visible={visible.mail} onHide={onHide} />}
      {visible.deletePO && <DeletePO visible={visible.deletePO} onHide={onHide} />}
      {visible.godownReceipt && <GodownReceipt visible={visible.godownReceipt} trip_id={trip_info.id} onHide={onHide} />}
    </Card>

  )
}

export default TripTime
