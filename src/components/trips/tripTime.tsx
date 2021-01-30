import { useState, useContext } from 'react'
import { Row, Col, Card, Form, Space, Button, Checkbox, message, Modal, Popconfirm } from 'antd'
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
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client'
import u from '../../lib/util'
import LinkComp from '../common/link'
import userContext from '../../lib/userContaxt'
import LabelWithData from '../common/labelWithData'
import LoadingMemo from './loadingMemo'
import moment from 'moment'

const CONFIG_QUERY = gql`
query config{
  config(where:{key:{_eq:"financial_year"}}){
    value
  }
} 
`

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

const GET_TOKEN = gql`query getToken($ref_id: Int!, $process: String!) {
  token(ref_id: $ref_id, process: $process)
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

const LOADING_MEMO_MUTATION = gql`
mutation loading_memo_pdf($id:Int!){
    loading_memo(trip_id: $id)
  }
`

const PARTNER_LOADING_MEMO_MUTATION = gql`
mutation partner_loading_memo_pdf($id:Int!){
    partner_loading_memo(trip_id: $id)
  }
`

const LOADING_MEMO_WORD_MUTATION = gql`
mutation loading_memo($id:Int!){
      loading_memo(trip_id: $id,word:true)
  }
`

const PARTNER_LOADING_MEMO_WORD_MUTATION = gql`
mutation partner_loading_memo($id:Int!){
      partner_loading_memo(trip_id: $id,word:true)
  }
`

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
mutation partner_advance ($tripId: Int!, $createdBy: String!, $customer_confirmation: Boolean!,$token:String!) {
  partner_advance(trip_id: $tripId, created_by: $createdBy, customer_confirmation: $customer_confirmation,token:$token) {
    description
    status
  }
}`

const TripTime = (props) => {
  const { trip_info, customerConfirm, lr_files } = props
  const initial = { checkbox: false, mail: false, deletePO: false, godownReceipt: false, wh_detail: false,loading_memo: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  
  const [disableBtn, setDisableBtn] = useState(false)
  const [loadingMemoCheck, setLoadingMemoCheck] = useState(false)
  const context = useContext(userContext)
  const { role } = u
  const po_delete_access = [role.admin, role.rm]
  const process_advance_access = [role.admin, role.rm, role.operations,role.bm]
  const advance_access = u.is_roles(process_advance_access, context)
  const access = (trip_info.loaded === 'No') || u.is_roles(po_delete_access, context)
  const truck_files = get(trip_info, 'truck.truck_files', [])
  const partner_files = get(trip_info, 'partner.partner_files', [])
  const truck_pan_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.partner_pan) : null
  const rc_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.rc) : null
  const partner_pan_files = !isEmpty(partner_files) ? partner_files.filter(file=> file.type ===  u.fileType.partner_pan) : null
  
  const customerPrice = get(trip_info, 'customer_price', null)
  const km = get(trip_info, 'km', null)
  const customerPricePerKm = (customerPrice / km)
  const loading_memo = get(trip_info,'truck.loading_memo',null)
  console.log('loading_memo', loading_memo)
  const pricePerKm = customerPricePerKm > 100
  const [form] = Form.useForm()
  const [getWord, { loading, data, error, called }] = useLazyQuery(GET_WORD)
  const [getPdf, { loading: pdfloading, data: pdfdata, error: pdferror, called: pdfcalled }] = useLazyQuery(GET_PDF)
  const [getToken, { data: tokenData, loading: tokenQueryLoading }] = useLazyQuery(GET_TOKEN, {
    fetchPolicy: 'network-only',
    variables: {
      ref_id: trip_info.id,
      process: 'ADVANCE'
    }
  })

  console.log('tripTime error', error)
  console.log('tripTime error', pdferror)
  console.log('truck_pan_files',truck_pan_files)

  let _data = {}
  if (!loading) {
    _data = data
  }

  let _pdfdata = {}
  if (!pdfloading) {
    _pdfdata = pdfdata
  }

  console.log('tokenQueryLoading', tokenQueryLoading)
  let token = null
  if (!tokenQueryLoading) {
    token = get(tokenData, 'token', null)
  }

  const { loading:config_loading, error:config_error, data:data_config } = useQuery(CONFIG_QUERY, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  console.log('Documents error',config_error)

  let config_data = {}
  if (!loading) {
    config_data = data_config
  }
 

  const tds_current_ = get(config_data, 'config[0].value.current', null)
  const tds_previous_ = get(config_data, 'config[0].value.previous', null)

  const word_url = get(_data, 'trip[0].loading_memo', [])
  const pdf_url = get(_pdfdata, 'trip[0].loading_memo', [])
  const [loadingmemo] = useMutation(
    LOADING_MEMO_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted (data) {
        window.open(data.loading_memo)
      }
    }
  )

  const [partnerloadingmemo] = useMutation(
    PARTNER_LOADING_MEMO_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted (data) {
        window.open(data.partner_loading_memo)
      }
    }
  )

  const [loadingmemoword] = useMutation(
    LOADING_MEMO_WORD_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted (data) {
        window.open(data.loading_memo)
      }
    }
  )

  const [partnerloadingmemoword] = useMutation(
    PARTNER_LOADING_MEMO_WORD_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted (data) {
        window.open(data.partner_loading_memo)
      }
    }
  )
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

  const onClickPdf = () => {
    loadingmemo({
      variables: { id: trip_info.id }
    }) 
  }
 

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
        customer_confirmation: customerConfirm || false,
        token: token
      }
    })
  }
  const onClickWord = () => {
    loadingmemoword({
      variables: { id: trip_info.id }
    })
  }

  const onClickPartnerWord = () => {
    partnerloadingmemoword({
      variables: { id: trip_info.id }
    })
  }

  const onHandleCancel = () => {
    setLoadingMemoCheck(false)
    setDisableBtn(false)
  }

  const onClickPartnerPdf = () => {
      partnerloadingmemo({
        variables: { id: trip_info.id }
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
  const getPartnerTDSDocument = (type, financial_year) => partner_files && partner_files.length > 0 ? partner_files.filter(data => data.type === type && data.financial_year === financial_year) : []
  const tdsYearValidation = moment(trip_info.created_at).isAfter("2020-04-01")
  const tdsYear = tdsYearValidation ? tds_current_ : tds_previous_;
  const getTruckTdsDocument = (type,financial_year) => truck_files && truck_files.length > 0 ? truck_files.filter(data => data.type === type && data.financial_year === financial_year) : []
  const partner_tds_file_list = !isEmpty(getPartnerTDSDocument( u.fileType.tds,tdsYear)) && getPartnerTDSDocument( u.fileType.tds,tdsYear).map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })
  const truck_tds_file_list = !isEmpty(getTruckTdsDocument( u.fileType.tds,tdsYear)) && getTruckTdsDocument( u.fileType.tds,tdsYear).map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  const fileValidation = loading_memo ?   rc_files.length>0 && truck_pan_files.length>0  && truck_tds_file_list.length > 0 : true
  

  return (
    
    <Card size='small' className='mt10'>
      <Row>
        <Col xs={24}>
          <Form layout='vertical' form={form}>
            <Row gutter={10}>
              <Col xs={24} sm={8}>
                <SourceInDate source_in={trip_info.source_in} id={trip_info.id} lock={lock} />
              </Col>
              <Col xs={24} sm={8}>
                <SourceOutDate source_out={trip_info.source_out} id={trip_info.id} lock={lock} />
              </Col>
              <Col xs={24} sm={8}>
                <Driver trip_info={trip_info} initialValue={driver_number} disable={after_deliverd || lock} />
              </Col>
            </Row>
            <Row gutter={10}>
              <Col xs={24} sm={8}>
                <DestinationInDate destination_in={trip_info.destination_in} id={trip_info.id} advance_processed={advance_processed} lock={lock} />
              </Col>
              <Col xs={24} sm={8}>
                <DestinationOutDate destination_out={trip_info.destination_out} id={trip_info.id} lock={lock} />
              </Col>
              <Col xs={24} sm={8}>
                <Row>
                  <Col xs={12}>
                    <Form.Item label='Fr8 - Memo'>
                      <Space>
                        <Button
                          type='primary' loading={pdfloading} shape='circle'
                          icon={<FilePdfOutlined />} onClick={onClickPdf}
                        />
                        <Button
                          type='primary' loading={loading} shape='circle'
                          icon={<FileWordOutlined />} onClick={onClickWord}
                        />
                      </Space>
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item label='Partner - Memo'>
                      <Space>                        
                      { 
                         (fileValidation) ? 
                          <Button
                          type='primary' loading={pdfloading} shape='circle'
                          icon={<FilePdfOutlined />} onClick={onClickPartnerPdf}
                        /> : 
                        <Button
                        type='primary' loading={pdfloading} shape='circle'
                        icon={<FilePdfOutlined />}  onClick={() => onShow('loading_memo')}
                      />
                         }
                          { 
                         (fileValidation) ? 
                       <Button
                          type='primary' loading={loading} shape='circle'
                          icon={<FileWordOutlined />} onClick={onClickPartnerWord}
                        /> : 
                        <Button
                        type='primary' loading={loading} shape='circle'
                        icon={<FileWordOutlined />}  onClick={() => onShow('loading_memo')}
                      />
                         }
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
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
                    />)
                    : null}
                </Space>}
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Space>
                {po_delete &&
                  <Button type='primary' danger icon={<DeleteOutlined />} onClick={() => onShow('deletePO')} disabled={(trip_info.loaded === 'Yes') ? !access : null || lock}>PO</Button>}
                {pricePerKm && advance_access && process_advance
                  ? <Popconfirm
                      title='Trip Rate/Km is more than 100. Do you want to process?'
                      okText='Yes'
                      cancelText='No'
                      onConfirm={onProcessAdvance}
                    >
                    <Button type='primary' onClick={() => getToken()} disabled={disable_pa || lock} loading={disableBtn}>Process Advance</Button>
                  </Popconfirm>
                  : (advance_access && process_advance
                      ? <Popconfirm
                          title='Are you sure to process advance?'
                          okText='Yes'
                          cancelText='No'
                          onConfirm={onProcessAdvance}
                        >
                        <Button type='primary' key='submit' onClick={() => getToken()} disabled={disable_pa || lock} loading={disableBtn}>Process Advance</Button>
                        </Popconfirm>
                      : null)}
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
      {visible.deletePO && <DeletePO visible={visible.deletePO} onHide={onHide} trip_info={trip_info} />}
      {visible.loading_memo && <LoadingMemo visible={visible.loading_memo} onHide={onHide} trip_info={trip_info} tds_current_={tds_current_} tds_previous_={tds_previous_}/>}
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
