import { useEffect, useState, useContext } from 'react'
import {
  Button,
  Row,
  Form,
  Input,
  Col,
  List,
  Checkbox,
  Space,
  Table,
  message,
  Card,
  Tooltip
} from 'antd'
import LinkComp from '../common/link'
import useShowHide from '../../hooks/useShowHide'
import FileUploadOnly from '../common/fileUploadOnly'
import { CheckOutlined,CarOutlined} from '@ant-design/icons'
import ViewFile from '../common/viewFile'
import DeleteFile from '../common/deleteFile'
import { gql, useMutation, useSubscription ,useQuery} from '@apollo/client'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import Loading from '../common/loading'
import u from '../../lib/util'
import NewTruck from './newTruck'
import TruckActivation from '../trucks/truckActivation'
import { useRouter } from 'next/router'


const TRUCKS_QUERY = gql`
query trucks_type_status{
  truck_type {
    id
    name
  }
} 
`

const PARTNERS_SUBSCRIPTION = gql`
subscription partner_kyc($id:Int){
  partner(where:{id:{_eq:$id}}){
    id
    name
    pan
    cardcode
    partner_advance_percentage{
      id
      name
    }
    onboarded_by{
      id
      name
    }
    display_account_number
    gst
    emi
    partner_files {
      id
      type
      folder
      file_path
      created_at
    }
    trucks{
      id
      truck_no
      truck_type{
        name
      }
      truck_status{
        id
        name
      }
    }
  }
}`

const CREATE_PARTNER_CODE_MUTATION = gql`
mutation create_partner_code(
  $cardcode: String, 
  $name: String!, 
  $partner_id: Int!,
  $pan_no:String!,
  $onboarded_by_id: Int!,
  $partner_advance_percentage_id: Int!
  $gst:String,
  $emi: Boolean!,
  $updated_by: String!,
  $approved_by: String! ) {
  create_partner_code(
    cardcode: $cardcode,
    name: $name, 
    partner_id: $partner_id,
    pan_no:$pan_no,
    onboarded_by_id: $onboarded_by_id, 
    partner_advance_percentage_id: $partner_advance_percentage_id, 
    gst: $gst, 
    emi: $emi, 
    updated_by: $updated_by,
    approved_by:$approved_by) {
    description
    status
  }
}`

const KycApproval = (props) => {
  const { partner_id, disableAddTruck} = props

  const initial = {
    truckActivationVisible: false,
    truckActivationData: [],
    showModal: false 
  }

  const router = useRouter()
  const [form] = Form.useForm()
  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const { visible, onShow, onHide } = useShowHide(initial)

  const [checked, setChecked] = useState(false)

  const onChange = (e) => {
    setChecked(e.target.checked)
  }

  const { loading:query_loading, error:query_error, data:query_data } = useQuery(TRUCKS_QUERY, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  let truck_data = {}
  if (!query_loading) {
    truck_data = query_data
  }
 
  const truck_type = get(truck_data, 'truck_type', [])

  const { data, error, loading } = useSubscription(
    PARTNERS_SUBSCRIPTION, {
      variables:
      {
        id: partner_id
      }
    })

  console.log('CreatePartnersContainer error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const partnerDetail = get(_data, 'partner[0]', [])

  useEffect(() => {
    setChecked(get(partnerDetail, 'emi', false))
  }, [partnerDetail])

  const name = get(partnerDetail, 'name', null)
  const cardcode = get(partnerDetail, 'cardcode', null)
  const trucks = get(partnerDetail, 'trucks', [])
  const files = get(partnerDetail, 'partner_files', [])

  const pan_files = !isEmpty(files) && files.filter(file => file.type === u.fileType.partner_pan)
  const tds_files = files.filter(file => file.type === u.fileType.tds)
  const cheaque_files = !isEmpty(files) && files.filter(file => file.type === u.fileType.check_leaf)
  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]
  const access = u.is_roles(edit_access, context)
  const [createPartnerCode] = useMutation(
    CREATE_PARTNER_CODE_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        setDisableButton(false)
        const status = get(data, 'create_partner_code.status', null)
        const description = get(data, 'create_partner_code.description', null)
        if (status === 'OK') {
          const url = '/partners/[id]'
          const as = `/partners/${description}`
          router.push(url, as, { shallow: true })
          message.success(description || 'Code created!')
        } else {
          message.error(description)
        }
      }
    }
  )

  const column = [
    {
      title: 'Truck No',
      dataIndex: 'truck_no',
      render: (text, record) => {
        return (
          <LinkComp
            type='trucks'
            data={text}
            id={record.truck_no}
          />)
      }
    },
    {
      title: 'Type',
      render: (text, record) => get(record, 'truck_type.name', null)
    },
    {
      title: 'Status',
      render: (text, record) => get(record, 'truck_status.name', null)
    },
    {
      title: 'Action',
      render: (text, record) => {
        return (
          <Button
                  type='primary'
                  size='small'
                  shape='circle'
                  className='btn-success'
                  disabled={!access}
                  icon={<CheckOutlined />}
                  onClick={() => handleShow('truckActivationVisible', null, 'truckActivationData', record.id)}
                />
        )
      }
    }
  ]

  const onCreatePartnerCodeSubmit = (form) => {
    if (isEmpty(trucks)) {
      message.error('Add truck before approve Partner!')
    } else if (isEmpty(pan_files)) {
      message.error('PAN documents are mandatory!')
    } 
    else if (isEmpty(cheaque_files)) {
      message.error('Cheque/Passbook documents are mandatory!')
    } 
    
    
    else {
      setDisableButton(true)
      createPartnerCode({
        variables: {
          partner_id: parseInt(partner_id, 10),
          cardcode: cardcode,
          name: name,
          pan_no: partnerDetail.pan,
          gst: form.gst,
          emi: !!checked,
          updated_by: context.email,
          approved_by:context.email,
          onboarded_by_id: get(partnerDetail, 'onboarded_by.id', null),
          partner_advance_percentage_id: get(partnerDetail, 'partner_advance_percentage.id', null),
         
        }
      })
    }
  }

  return (
    <>
      {loading ? <Loading />
        : (
          <Row gutter={20}>
            <Col xs={24} sm={12}>
              <Card
                size='small'
                title={isEmpty(trucks) ? 'Add Truck' : 'Trucks Detail'}
                extra={
                  <Tooltip title='Add Truck'>
                    <Button type='primary' className='addtruck' shape='circle' icon={<CarOutlined />}  onClick={() => onShow('showModal')} />
                  </Tooltip>
              }
                className='border-top-blue'
              >
                {!isEmpty(trucks) ? 
                   (
                    <>
                    <Table
                      columns={column}
                      dataSource={trucks}
                      size='small'
                      pagination={false}
                      rowKey={record => record.truck_no}
                    />
                    {object.truckActivationVisible && (
                      <TruckActivation
                        visible={object.truckActivationVisible}
                        onHide={handleHide}
                        truck_id={object.truckActivationData}
                        truck_type={truck_type}
                      />
                    )}
                    </>
                  ):null}
                   {visible.showModal && <NewTruck visible={visible.showModal} partner_info={partnerDetail} disableAddTruck={disableAddTruck} onHide={onHide} />}
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                size='small'
                title='KYC Approval'
                className='border-top-blue'
              >
                <Form layout='vertical' onFinish={onCreatePartnerCodeSubmit} form={form}>
                  <List bordered size='small' className='mb10'>
                    <List.Item key={1}>
                      <Col xs={24} sm={8}>PAN Document</Col>
                      <Col xs={12} sm={12}>{partnerDetail && partnerDetail.pan}</Col>
                      <Col xs={12} sm={4} className='text-right'>
                        <Space>
                          <span>
                            {!isEmpty(pan_files) ? (
                              <Space>
                                <ViewFile
                                  size='small'
                                  id={partner_id}
                                  type='partner'
                                  file_type={u.fileType.partner_pan}
                                  folder={u.folder.approvals}
                                  file_list={pan_files}
                                />
                                <DeleteFile
                                  size='small'
                                  id={partner_id}
                                  type='partner'
                                  file_type={u.fileType.partner_pan}
                                  file_list={pan_files}
                                />
                              </Space>
                            ) : (
                              <FileUploadOnly
                                size='small'
                                id={partner_id}
                                type='partner'
                                folder={u.folder.approvals}
                                file_type={u.fileType.partner_pan}
                                file_list={pan_files}
                              />
                            )}
                          </span>
                        </Space>
                      </Col>
                    </List.Item>
                    <List.Item key={2}>
                      <Col xs={24} sm={8}>Cheque/Passbook</Col>
                      <Col xs={12} sm={12}>{get(partnerDetail, 'display_account_number', null)}</Col>
                      <Col xs={12} sm={4} className='text-right'>
                        <Space>
                          <span>
                            {!isEmpty(cheaque_files) ? (
                              <Space>
                                <ViewFile
                                  size='small'
                                  id={partner_id}
                                  type='partner'
                                  file_type={u.fileType.check_leaf}
                                  folder={u.folder.approvals}
                                  file_list={cheaque_files}
                                />
                                <DeleteFile
                                  size='small'
                                  id={partner_id}
                                  type='partner'
                                  file_type={u.fileType.check_leaf}
                                  file_list={cheaque_files}
                                />
                              </Space>
                            ) : (
                              <FileUploadOnly
                                size='small'
                                id={partner_id}
                                type='partner'
                                folder={u.folder.approvals}
                                file_type={u.fileType.check_leaf}
                                file_list={cheaque_files}
                              />
                            )}
                          </span>
                        </Space>
                      </Col>
                    </List.Item>
                    <List.Item key={3}>
                      <Col xs={24} sm={8}>TDS 19-20</Col>
                      <Col xs={12} sm={12}>{partnerDetail && partnerDetail.tds}</Col>
                      <Col xs={12} sm={4} className='text-right'>
                        <Space>
                          <span>
                            {!isEmpty(tds_files) ? (
                              <Space>
                                <ViewFile
                                  size='small'
                                  id={partner_id}
                                  type='partner'
                                  file_type={u.fileType.tds}
                                  folder={u.folder.approvals}
                                  file_list={tds_files}
                                />
                                <DeleteFile
                                  size='small'
                                  id={partner_id}
                                  type='partner'
                                  file_type={u.fileType.tds}
                                  file_list={tds_files}
                                />
                              </Space>
                            ) : (
                              <FileUploadOnly
                                size='small'
                                id={partner_id}
                                type='partner'
                                folder={u.folder.approvals}
                                file_type={u.fileType.tds}
                                file_list={tds_files}
                              />
                            )}
                          </span>
                        </Space>
                      </Col>
                    </List.Item>
                    <List.Item key={4}>
                      <Col xs={24} sm={8}>TDS 20-21</Col>
                      <Col xs={12} sm={12}>{partnerDetail && partnerDetail.tds}</Col>
                      <Col xs={12} sm={4} className='text-right'>
                        <Space>
                          <span>
                            {!isEmpty(tds_files) ? (
                              <Space>
                                <ViewFile
                                  size='small'
                                  id={partner_id}
                                  type='partner'
                                  file_type={u.fileType.tds}
                                  folder={u.folder.approvals}
                                  file_list={tds_files}
                                />
                                <DeleteFile
                                  size='small'
                                  id={partner_id}
                                  type='partner'
                                  file_type={u.fileType.tds}
                                  file_list={tds_files}
                                />
                              </Space>
                            ) : (
                              <FileUploadOnly
                                size='small'
                                id={partner_id}
                                type='partner'
                                folder={u.folder.approvals}
                                file_type={u.fileType.tds}
                                file_list={tds_files}
                                financial_year={1920}
                              />
                            )}
                          </span>
                        </Space>
                      </Col>
                    </List.Item>
                    <List.Item key={5}>
                      <Col xs={24} sm={20}>
                        <Row>
                          <Col xs={10}>GST Applicable</Col>
                          <Col xs={14}>
                            <Form.Item className='mb0' name='gst' initialValue={get(partnerDetail, 'gst', null)}>
                              <Input placeholder='GST Number' size='small' />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} sm={4} className='text-right'>&nbsp;</Col>
                    </List.Item>
                    <List.Item key={6}>
                      <Form.Item className='mb0' initialValue={get(partnerDetail, 'emi', false)}>
                        <Checkbox checked={checked} onChange={onChange}>EMI</Checkbox>
                      </Form.Item>
                      <Col xs={12} sm={12}>&nbsp;</Col>
                      <Col xs={12} sm={4} className='text-right'>&nbsp;</Col>
                    </List.Item>
                  </List>
                  <Row justify='end' className='mt10'>
                    <Button key='submit' type='primary' loading={disableButton} disabled={ isEmpty(trucks) || disableAddTruck || !access} htmlType='submit'>
                      Approve KYC
                    </Button>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>)}
    </>
  )
}

export default KycApproval
