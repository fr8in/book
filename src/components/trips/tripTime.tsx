import { Row, Col, Card, Form, Input, Space, Button, Checkbox, message } from 'antd'
import {
  FilePdfOutlined,
  FileWordOutlined,
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
import ViewFile from '../common/viewFile'
import get from 'lodash/get'
import { gql, useMutation, useLazyQuery } from '@apollo/client'

const GET_WORD = gql`
query loading_memo($id:Int!){
  trip(where:{id:{_eq:$id}}) {
    loading_memo(word:true)
  }
}`

const GET_PDF = gql`
query loading_memo_pdf($id:Int!){
  trip(where:{id:{_eq:$id}}) {
    loading_memo
  }
}`

const REMOVE_SOUT_MUTATION = gql`
mutation remove_souce_out($source_out:timestamptz,$id:Int!) {
  update_trip(_set: {source_out: $source_out}, where: {id: {_eq: $id}}) {
    returning {
      id
      source_out
    }
  }
}
`

const REMOVE_DOUT_MUTATION = gql`
mutation remove_destination_out($destination_out:timestamptz,$id:Int!) {
  update_trip(_set: {destination_out: $destination_out}, where: {id: {_eq: $id}}) {
    returning {
      id
      destination_out
    }
  }
}
`
const TO_PAY_MUTATION = gql`
mutation insert_to_pay($to_pay: Float, $comment: String, $trip_id: Int!) {
  insert_trip_price(objects: {to_pay: $to_pay, comment:$comment, trip_id: $trip_id}) {
    returning {
      to_pay
      comment
    }
  }
}
`
const PROCESS_ADVANCE_MUTATION = gql`
mutation process_advance ($tripId: Int!, $createdBy: String!) {
  partner_advance(trip_id: $tripId, created_by: $createdBy) {
    description
    status
  }
}
`
const TripTime = (props) => {
  const { trip_info } = props
  console.log('trip_info', trip_info)
  const initial = { checkbox: false, mail: false, deletePO: false, godownReceipt: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const [getWord, { loading, data, error, called }] = useLazyQuery(GET_WORD)
  const [getPdf, { loading: pdfloading, data: pdfdata, error: pdferror, called: pdfcalled }] = useLazyQuery(GET_PDF)

  console.log('tripTime error', error)
  console.log('tripTime error', pdferror)

  let _data = {}
  if (!loading) {
    _data = data
  }

  let _pdfdata = {}
  if (!pdfloading) {
    _pdfdata = pdfdata
  }

  let word_url = get(_data, 'trip[0].loading_memo', [])
  let pdf_url = get(_pdfdata, 'trip[0].loading_memo', [])

  const onWordClick = () => {
    console.log('trip_info.id', trip_info.id)
    getWord({
      variables: { id: trip_info.id }
    })
    setTimeout(() => {
      if (called && word_url) {
        window.open(word_url)
        word_url = null
      }
    }, 2000)
  }

  const onPdfClick = () => {
    console.log('trip_info.id', trip_info.id)
    getPdf({
      variables: { id: trip_info.id }
    })
    setTimeout(() => {
      if (pdfcalled && pdf_url) {
        window.open(pdf_url)
        pdf_url = null
      }
    }, 2000)
  }

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

  const [processAdvance] = useMutation(
    PROCESS_ADVANCE_MUTATION,
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
  const onProcessAdvance = () => {
    processAdvance({
      variables: {
        tripId: trip_info.id,
        createdBy: 'shilpa.v@fr8.in'
      }
    })
  }
  const getToPay = (form) => {
    console.log('form', form)
    insertTopay({
      variables: {
        to_pay: form.to_pay,
        comment: form.comment,
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
  const process_advance = trip_info.source_in && trip_info.source_out && (trip_info.loaded === 'N' || !trip_info.loaded)
  const remove_sout = trip_info.trip_status && trip_info.trip_status.name === 'Intransit' && authorized
  const remove_dout = trip_info.trip_status && trip_info.trip_status.name === 'Delivered' && authorized

  // const toPayCheck = !!(trip_info.source_in && trip_info.source_out && trip_info.destination_in && (trip_info && trip_info.trip_prices[0] ? trip_info.trip_prices[0].to_pay : null))
  // console.log('toPayCheck', toPayCheck)

  const wh_files = trip_info && trip_info.trip_files && trip_info.trip_files.length > 0 ? trip_info.trip_files.filter(file => file.type === 'WH') : null
  console.log('wh', wh_files)

  const driver_number = trip_info && trip_info.driver && trip_info.driver.mobile

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
                <Driver trip_info={trip_info} initialValue={driver_number}/>
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
                    <Button type='primary' loading={pdfloading} shape='circle' icon={<FilePdfOutlined />} onClick={onPdfClick} />
                    <Button type='primary' loading={loading} shape='circle' icon={<FileWordOutlined />} onClick={onWordClick} />
                    {/* <Button shape='circle' icon={<MailOutlined />} onClick={() => onShow('mail')} /> */}
                  </Space>
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={10}>
              <Col xs={8}>
                <Form.Item label='To-Pay Amount' name='to_pay'>
                  <Input
                    id='toPay'
                    placeholder='To Pay Amount'
                    type='number'
                    disabled={!toPayCheck}
                    required={toPayCheck}
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item label='To-Pay Comment' name='comment'>
                  <Input
                    id='comment'
                    placeholder='To Pay Comment'
                    disabled={!toPayCheck}
                    required={toPayCheck}
                  />
                </Form.Item>
              </Col>
              <Col xs={4} className='text-right'>
                <Form.Item label>
                  <Button type='primary' htmlType='submit' disabled={!toPayCheck}>Submit</Button>
                </Form.Item>
              </Col>
            </Row> */}
            <Row className='mb15'>
              <Col xs={20}>
                <Checkbox disabled={!!(trip_info && trip_info.unloaded_private_godown === true)} onClick={() => onShow('godownReceipt')}>Unloaded at private godown</Checkbox>
              </Col>
              <Col xs={4} className='text-right'>
              {wh_files && wh_files.length > 0 ? (
                <ViewFile
                  id={trip_info.id}
                  type='trip'
                  folder='warehousereceipt/'
                  file_type='WH'
                  file_list={wh_files}
                />) : (null)}
              </Col>
            </Row>
            <Row>
              <Col xs={16}>
                <Space>
                  {po_delete &&
                    <Button type='primary' danger icon={<DeleteOutlined />} onClick={() => onShow('deletePO')}>PO</Button>}
                  {process_advance &&
                    <Button type='primary' onClick={onProcessAdvance} >Process Advance</Button>}
                  {remove_sout &&
                    <Button danger icon={<CloseCircleOutlined />} onClick={onSoutRemove}>Sout</Button>}
                  {remove_dout &&
                    <Button danger icon={<CloseCircleOutlined />} onClick={onDoutRemove}>Dout</Button>}
                </Space>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      {visible.mail && <SendLoadingMemo visible={visible.mail} onHide={onHide} />}
      {visible.deletePO && <DeletePO visible={visible.deletePO} onHide={onHide} />}
      {visible.godownReceipt && <GodownReceipt visible={visible.godownReceipt} trip_id={trip_info.id} trip_info={trip_info} onHide={onHide} />}
    </Card>

  )
}

export default TripTime
