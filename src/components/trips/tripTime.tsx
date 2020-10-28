import { useState, useContext } from 'react'
import { Row, Col, Card, Form, Space, Button, Checkbox, message, Modal } from 'antd'
import {
  FilePdfOutlined,
  FileWordOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  FileTextOutlined
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
import isEmpty from 'lodash/isEmpty'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import u from '../../lib/util'

import userContext from '../../lib/userContaxt'
import LabelWithData from '../common/labelWithData'

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

const REMOVE_SIN_MUTATION = gql`
mutation remove_souce_in($source_in:timestamp,$id:Int!,$updated_by: String!) {
  update_trip(_set: {source_in: $source_in,updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      id
      source_out
    }
  }
}`

const REMOVE_SOUT_MUTATION = gql`
mutation remove_souce_out($source_out:timestamp,$id:Int!,$updated_by: String!) {
  update_trip(_set: {source_out: $source_out,updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      id
      source_out
    }
  }
}`

const REMOVE_DIN_MUTATION = gql`
mutation remove_destination_in($destination_in:timestamp,$id:Int!,$updated_by: String!) {
  update_trip(_set: {destination_in: $destination_in,updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      id
      destination_out
    }
  }
}`

const REMOVE_DOUT_MUTATION = gql`
mutation remove_destination_out($destination_out:timestamp,$id:Int!,$updated_by: String!) {
  update_trip(_set: {destination_out: $destination_out,updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      id
      destination_out
    }
  }
}`

const PROCESS_ADVANCE_MUTATION = gql`
mutation partner_advance ($tripId: Int!, $createdBy: String!, $customer_confirmation: Boolean!) {
  partner_advance(trip_id: $tripId, created_by: $createdBy, customer_confirmation: $customer_confirmation) {
    description
    status
  }
}`

const TripTime = (props) => {
  const { trip_info, customerConfirm, lr_files } = props
  const initial = { checkbox: false, mail: false, deletePO: false, godownReceipt: false, wh_detail: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const [disableBtn, setDisableBtn] = useState(false)
  const context = useContext(userContext)
  const { role } = u
  const po_delete_access = [role.admin, role.rm]
  const access = (trip_info.loaded === 'No') || u.is_roles(po_delete_access,context) 
  const [form] = Form.useForm()

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

  const [removeSin] = useMutation(
    REMOVE_SIN_MUTATION,
    {
      onError (error) {
        setDisableBtn(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableBtn(false)
        message.success('Updated!!')
        form.resetFields()
      }
    }
  )
  const [removeSout] = useMutation(
    REMOVE_SOUT_MUTATION,
    {
      onError (error) {
        setDisableBtn(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableBtn(false)
        message.success('Updated!!')
        form.resetFields()
      }
    }
  )

  const [removeDin] = useMutation(
    REMOVE_DIN_MUTATION,
    {
      onError (error) {
        setDisableBtn(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableBtn(false)
        message.success('Updated!!')
        form.resetFields()
      }
    }
  )
  const [removeDout] = useMutation(
    REMOVE_DOUT_MUTATION,
    {
      onError (error) {
        setDisableBtn(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableBtn(false)
        message.success('Updated!!')
        form.resetFields()
      }
    }
  )

  const [processAdvance] = useMutation(
    PROCESS_ADVANCE_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
        setDisableBtn(false)
      },
      onCompleted (data) {
        setDisableBtn(false)
        const status = get(data, 'partner_advance.status', null)
        const description = get(data, 'partner_advance.description', null)
        if (status === 'OK') {
          message.success(description || 'Advance Processed!')
        } else {
          message.error(description)
        }
      }
    }
  )

  const onSinRemove = () => {
    setDisableBtn(true)
    removeSin({
      variables: {
        id: trip_info.id,
        source_in: null,
        updated_by: context.email
      }
    })
  }
  const onSoutRemove = () => {
    setDisableBtn(true)
    removeSout({
      variables: {
        id: trip_info.id,
        source_out: null,
        updated_by: context.email
      }
    })
  }
  const onDinRemove = () => {
    setDisableBtn(true)
    removeDin({
      variables: {
        id: trip_info.id,
        destination_in: null,
        updated_by: context.email
      }
    })
  }
  const onDoutRemove = () => {
    setDisableBtn(true)
    removeDout({
      variables: {
        id: trip_info.id,
        destination_out: null,
        updated_by: context.email
      }
    })
  }
  const onProcessAdvance = () => {
    setDisableBtn(true)
    processAdvance({
      variables: {
        tripId: trip_info.id,
        createdBy: context.email,
        customer_confirmation: customerConfirm || false
      }
    })
  }

  const trip_status_name = get(trip_info, 'trip_status.name', null)
  const po_delete = (trip_status_name === 'Assigned' || trip_status_name === 'Confirmed' || trip_status_name === 'Reported at source') && !trip_info.source_out
  const process_advance = trip_info.source_out && (trip_info.loaded !== 'Yes')
  const remove_sin = trip_status_name === 'Reported at source'
  const remove_sout = trip_status_name === 'Intransit'
  const remove_din = trip_status_name === 'Reported at destination'
  const remove_dout = (trip_status_name === 'Delivered')
  const advance_processed = (trip_info.loaded === 'Yes')
  const trip_files = get(trip_info, 'trip_files', [])
  const wh_files = !isEmpty(trip_files) ? trip_files.filter(file => file.type === u.fileType.wh) : null
  const driver_number = get(trip_info, 'driver.mobile', null)
  const trip_status_id = get(trip_info, 'trip_status.id', null)
  const after_deliverd = (trip_status_id >= 9)
  const wh_update = (trip_status_id > 5)
  const disable_pa = (!customerConfirm && isEmpty(lr_files))
  const lock = get(trip_info, 'transaction_lock', null)

  return (
    <Card size='small' className='mt10'>
      <Row>
        <Col xs={24}>
          <Form layout='vertical' form={form}>
            <Row gutter={10}>
              <Col xs={8}>
                <SourceInDate source_in={trip_info.source_in} id={trip_info.id} lock={lock} />
              </Col>
              <Col xs={8}>
                <SourceOutDate source_out={trip_info.source_out} id={trip_info.id} lock={lock} />
              </Col>
              <Col xs={8}>
                <Driver trip_info={trip_info} initialValue={driver_number} disable={after_deliverd || lock} />
              </Col>
            </Row>
            <Row gutter={10}>
              <Col xs={8}>
                <DestinationInDate destination_in={trip_info.destination_in} id={trip_info.id} advance_processed={advance_processed} lock={lock} />
              </Col>
              <Col xs={8}>
                <DestinationOutDate destination_out={trip_info.destination_out} id={trip_info.id} lock={lock} />
              </Col>
              <Col xs={8}>
                <Form.Item label='Loading Memo'>
                  <Space>
                    <Button type='primary' loading={pdfloading} shape='circle' icon={<FilePdfOutlined />} onClick={onPdfClick} />
                    <Button type='primary' loading={loading} shape='circle' icon={<FileWordOutlined />} onClick={onWordClick} />
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Row className='mb5'>
            <Col xs={20}>
              <Checkbox
                checked={get(trip_info, 'unloaded_private_godown', false)}
                disabled={wh_update || get(trip_info, 'unloaded_private_godown', false) || lock}
                onClick={get(trip_info, 'unloaded_private_godown', false) ? () => { } : () => onShow('godownReceipt')}
              >Unloaded at private godown
              </Checkbox>
            </Col>
            <Col xs={4} className='text-right'>
              {get(trip_info, 'unloaded_private_godown', false) &&
                <Space>
                  <Button
                    shape='circle'
                    onClick={() => onShow('wh_detail')}
                    icon={<FileTextOutlined />}
                  />
                  {wh_files && wh_files.length > 0 ? (
                    <ViewFile
                      id={trip_info.id}
                      type='trip'
                      folder={u.folder.wh}
                      file_type={u.fileType.wh}
                      file_list={wh_files}
                    />) : null}
                </Space>}
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Space>
                {po_delete &&
                  <Button type='primary' danger icon={<DeleteOutlined />} onClick={() => onShow('deletePO')} disabled={!access || lock}>PO</Button>}
                {process_advance &&
                  <Button type='primary' onClick={onProcessAdvance} disabled={disable_pa || lock} loading={disableBtn}>Process Advance</Button>}
                {remove_sin &&
                  <Button danger icon={<CloseCircleOutlined />} onClick={onSinRemove} disabled={lock} loading={disableBtn}>S-In</Button>}
                {remove_sout &&
                  <Button danger icon={<CloseCircleOutlined />} onClick={onSoutRemove} disabled={lock} loading={disableBtn}>S-Out</Button>}
                {remove_din &&
                  <Button danger icon={<CloseCircleOutlined />} onClick={onDinRemove} disabled={lock} loading={disableBtn}>D-In</Button>}
                {remove_dout &&
                  <Button danger icon={<CloseCircleOutlined />} onClick={onDoutRemove} disabled={lock} loading={disableBtn}>D-Out</Button>}
              </Space>
            </Col>
          </Row>

        </Col>
      </Row>
      {visible.mail && <SendLoadingMemo visible={visible.mail} onHide={onHide} />}
      {visible.deletePO && <DeletePO visible={visible.deletePO} onHide={onHide} trip_id={trip_info.id} />}
      {visible.godownReceipt && <GodownReceipt visible={visible.godownReceipt} trip_id={trip_info.id} trip_info={trip_info} onHide={onHide} />}
      {visible.wh_detail &&
        <Modal
          title='Godown Address'
          visible={visible.wh_detail}
          onCancel={onHide}
          footer={null}
        >
          {get(trip_info, 'private_godown_address', false) &&
            <div>
              <LabelWithData label='Building No' data={get(trip_info, 'private_godown_address.no', '-')} labelSpan={8} />
              <LabelWithData label='Address' data={get(trip_info, 'private_godown_address.address', '-')} labelSpan={8} />
              <LabelWithData label='City' data={get(trip_info, 'private_godown_address.city', '-')} labelSpan={8} />
              <LabelWithData label='Pin Code' data={get(trip_info, 'private_godown_address.pin_code', '-')} labelSpan={8} />
              <LabelWithData label='State' data={get(trip_info, 'private_godown_address.state', '-')} labelSpan={8} />
            </div>}
        </Modal>}
    </Card>

  )
}

export default TripTime
