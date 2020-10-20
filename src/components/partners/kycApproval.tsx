import { useEffect, useState, useContext } from 'react'
import {
  Modal,
  Button,
  Row,
  Form,
  Select,
  Input,
  Col,
  List,
  Checkbox,
  Space,
  Table,
  message
} from 'antd'
import LinkComp from '../common/link'
import FileUploadOnly from '../common/fileUploadOnly'
import ViewFile from '../common/viewFile'
import DeleteFile from '../common/deleteFile'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import Loading from '../common/loading'
import Truncate from '../common/truncate'

const PARTNERS_QUERY = gql`
  query create_partner{
    employee(where:{active: {_eq: 1}}){
      id
      email
    }
    partner_advance_percentage{
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
    cibil
    emi
    partner_files {
      id
      type
      folder
      file_path
      created_at
    }
    trucks{
      truck_no
      truck_type{
        name
      }
    }
  }
}
`

const UPDATE_PARTNER_APPOVAL_MUTATION = gql`
mutation update_partner_approval($onboarded_by_id:Int,$partner_advance_percentage_id:Int,$gst:String,$cibil:String,$emi:Boolean,$id:Int,$partner_status_id:Int,$updated_by: String!, $onboarded_date: timestamp){
  update_partner(_set: {onboarded_by_id:$onboarded_by_id, partner_advance_percentage_id:$partner_advance_percentage_id, gst:$gst, cibil:$cibil, emi:$emi,partner_status_id:$partner_status_id,updated_by:$updated_by, onboarded_date: $onboarded_date}, where: {id: {_eq:$id}}) {
    returning {
      id
    }
  }
}`

const CREATE_PARTNER_CODE_MUTATION = gql`
mutation create_partner_code($cardcode: String, $name: String!, $partner_id: Int!, $pay_terms_code: Int!,$pan_no:String!) {
  create_partner_code(cardcode: $cardcode,name: $name, partner_id: $partner_id, pay_terms_code: $pay_terms_code, pan_no:$pan_no) {
    description
    status
  }
}`

const KycApproval = (props) => {
  const { visible, onHide, partner_id } = props
  const [form] = Form.useForm()
  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)

  const [checked, setChecked] = useState(false)

  const onChange = (e) => {
    setChecked(e.target.checked)
  }

  const { loading, error, data } = useQuery(
    PARTNERS_QUERY, {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('CreatePartnersContainer error', error)
  const { data: partnerData, error: partnerError, loading: partnerLoading } = useSubscription(
    PARTNERS_SUBSCRIPTION, {
      variables:
      {
        id: partner_id
      }
    })

  const partnerDetail = get(partnerData, 'partner[0]', [])
  console.log('KycApproval error', partnerError, partnerDetail)

  useEffect(() => {
    setChecked(get(partnerDetail, 'emi', false))
  }, [partnerDetail])

  const name = get(partnerDetail, 'name', null)
  const cardcode = get(partnerDetail, 'cardcode', null)
  const trucks = get(partnerDetail, 'trucks', [])
  const files = get(partnerDetail, 'partner_files', [])

  const pan_files = !isEmpty(files) && files.filter(file => file.type === 'PAN')
  const cheaque_files = !isEmpty(files) && files.filter(file => file.type === 'CL')
  const agreement_files = !isEmpty(files) && files.filter(file => file.type === 'AGREEMENT')
  const cs_files = !isEmpty(files) && files.filter(file => file.type === 'CS')

  const [updatePartnerApproval] = useMutation(
    UPDATE_PARTNER_APPOVAL_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Saved!!')
      }
    }
  )

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
          message.success(description || 'Code created!')
          onPartnerApprovalSubmit()
          onHide()
        } else {
          message.error(description)
        }
      }
    }
  )

  var employee = []
  var partner_advance_percentage = []
  if (!loading) {
    partner_advance_percentage = data.partner_advance_percentage
    employee = data.employee
  }

  const advancePercentageList = partner_advance_percentage.map((data) => {
    return { value: data.id, label: data.name }
  })
  const employeeList = employee.map((data) => {
    return { value: data.id, label: data.email }
  })

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
      dataIndex: 'type',
      render: (text, record) => record && record.truck_type && record.truck_type.name
    }
  ]

  const onPartnerApprovalSubmit = () => {
    setDisableButton(true)
    updatePartnerApproval({
      variables: {
        id: partner_id,
        partner_status_id: 4,
        gst: form.getFieldValue('gst'),
        cibil: form.getFieldValue('cibil'),
        emi: checked,
        onboarded_by_id: form.getFieldValue('onboarded_by_id') || get(partnerDetail, 'onboarded_by.id', null),
        updated_by: context.email,
        partner_advance_percentage_id: form.getFieldValue('partner_advance_percentage_id') || get(partnerDetail, 'partner_advance_percentage.id', null),
        onboarded_date: moment().format('YYYY-MM-DD')
      }
    })
  }

  const onCreatePartnerCodeSubmit = () => {
    if (isEmpty(trucks)) {
      message.error('Add truck before approve Partner!')
    } else if (isEmpty(pan_files) || isEmpty(cheaque_files) || isEmpty(agreement_files) || isEmpty(cs_files)) {
      message.error('All documents are mandatory!')
    } else {
      setDisableButton(true)
      createPartnerCode({
        variables: {
          name: name,
          pay_terms_code: form.getFieldValue('partner_advance_percentage_id') || get(partnerDetail, 'partner_advance_percentage.id', null),
          partner_id: partner_id,
          pan_no: partnerDetail.pan,
          cardcode: get(partnerDetail, 'cardcode', null)
        }
      })
    }
  }

  return (
    <Modal
      visible={visible}
      title='KYC Approval'
      onCancel={onHide}
      style={{ top: 10 }}
      bodyStyle={{ padding: 10 }}
      width={700}
      footer={[
        null
      ]}
    >
      {partnerLoading ? <Loading /> : (
        <Form layout='vertical' onFinish={onCreatePartnerCodeSubmit} form={form}>
          <Row gutter={10}>
            <Col xs={24} sm={6}>
              <Form.Item name='partnerName' label='Partner Name'>
                {cardcode ? (
                  <LinkComp
                    type='partners'
                    data={name}
                    id={cardcode}
                  />) : <Truncate data={name} length={15} />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label='Advance Percentage'
                name='partner_advance_percentage_id'
                rules={[{ required: true }]}
                initialValue={get(partnerDetail, 'partner_advance_percentage.id', null)}
              >
                <Select
                  placeholder='Advance Percentage'
                  options={advancePercentageList}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
              <Form.Item
                label='On Boarded By'
                name='onboarded_by_id'
                rules={[{ required: true }]}
                initialValue={get(partnerDetail, 'onboarded_by.id', null)}
              >
                <Select placeholder='On Boarded By' options={employeeList} optionFilterProp='label' showSearch />
              </Form.Item>
            </Col>
          </Row>
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
                          file_type='PAN'
                          folder='approvals/'
                          file_list={pan_files}
                        />
                        <DeleteFile
                          size='small'
                          id={partner_id}
                          type='partner'
                          file_type='PAN'
                          file_list={pan_files}
                        />
                      </Space>
                    ) : (
                      <FileUploadOnly
                        size='small'
                        id={partner_id}
                        type='partner'
                        folder='approvals/'
                        file_type='PAN'
                        file_list={pan_files}
                      />
                    )}
                  </span>
                </Space>
              </Col>
            </List.Item>
            <List.Item key={2}>
              <Col xs={24} sm={8}>Cheque/Passbook</Col>
              <Col xs={12} sm={12}>{get(partnerDetail, 'display_account_number', '-')}</Col>
              <Col xs={12} sm={4} className='text-right'>
                <Space>
                  <span>
                    {!isEmpty(cheaque_files) ? (
                      <Space>
                        <ViewFile
                          size='small'
                          id={partner_id}
                          type='partner'
                          file_type='CL'
                          folder='approvals/'
                          file_list={cheaque_files}
                        />
                        <DeleteFile
                          size='small'
                          id={partner_id}
                          type='partner'
                          file_type='CL'
                          file_list={cheaque_files}
                        />
                      </Space>
                    ) : (
                      <FileUploadOnly
                        size='small'
                        id={partner_id}
                        type='partner'
                        folder='approvals/'
                        file_type='CL'
                        file_list={cheaque_files}
                      />
                    )}
                  </span>
                </Space>
              </Col>
            </List.Item>
            <List.Item key={3}>
              <Col xs={24} sm={8}>Agreement</Col>
              <Col xs={12} sm={12}>&nbsp;</Col>
              <Col xs={12} sm={4} className='text-right'>
                <Space>
                  <span>
                    {!isEmpty(agreement_files) ? (
                      <ViewFile
                        size='small'
                        id={partner_id}
                        type='partner'
                        file_type='AGREEMENT'
                        folder='approvals/'
                        file_list={agreement_files}
                      />
                    ) : (
                      <FileUploadOnly
                        size='small'
                        id={partner_id}
                        type='partner'
                        folder='approvals/'
                        file_type='AGREEMENT'
                        file_list={agreement_files}
                      />)}
                  </span>
                </Space>
              </Col>
            </List.Item>
            <List.Item key={4}>
              <Col xs={24} sm={20}>
                <Row>
                  <Col xs={10}>Cibil Score</Col>
                  <Col xs={14}>
                    <Form.Item name='cibil' className='mb0' initialValue={get(partnerDetail, 'cibil', null)}>
                      <Input placeholder='Cibil Score' size='small' type='number' />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={4} className='text-right'>
                <Space>
                  <span>
                    {!isEmpty(cs_files) ? (
                      <Space>
                        <ViewFile
                          size='small'
                          id={partner_id}
                          type='partner'
                          file_type='CS'
                          folder='approvals/'
                          file_list={cs_files}
                        />
                        <DeleteFile
                          size='small'
                          id={partner_id}
                          type='partner'
                          file_type='CS'
                          file_list={cs_files}
                        />
                      </Space>
                    ) : (
                      <FileUploadOnly
                        size='small'
                        id={partner_id}
                        type='partner'
                        folder='approvals/'
                        file_type='CS'
                        file_list={cs_files}
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
                    <Form.Item name='gst' initialValue={get(partnerDetail, 'gst', null)}>
                      <Input placeholder='GST Number' size='small' />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} sm={4} className='text-right'>&nbsp;</Col>
            </List.Item>
            <List.Item key={6}>
              <Form.Item initialValue={get(partnerDetail, 'emi', false)}>
                <Checkbox checked={checked} onChange={onChange}>EMI</Checkbox>
              </Form.Item>
              <Col xs={12} sm={12}>&nbsp;</Col>
              <Col xs={12} sm={4} className='text-right'>&nbsp;</Col>
            </List.Item>
          </List>
          <Table
            columns={column}
            dataSource={trucks}
            size='small'
            pagination={false}
          />
          <Row justify='end' className='mt10'>
            <Button key='submit' type='primary' loading={disableButton} htmlType='submit'>
            Approve KYC
            </Button>
          </Row>
        </Form>)}
    </Modal>
  )
}

export default KycApproval
