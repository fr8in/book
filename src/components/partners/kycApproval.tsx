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
import { useState, useContext } from 'react'
import get from 'lodash/get'
import moment from 'moment'

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
    partner_advance_percentage_id
    account_number
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

  const { loading, error, data } = useQuery(
    PARTNERS_QUERY, { notifyOnNetworkStatusChange: true }
  )
  console.log('CreatePartnersContainer error', error)
  const { data: partnerData } = useSubscription(
    PARTNERS_SUBSCRIPTION, {
      variables:
    {
      id: partner_id
    }
    }
  )

  const partnerDetail = partnerData && partnerData.partner[0]

  const name = partnerDetail && partnerDetail.name
  const cardcode = partnerDetail && partnerDetail.cardcode
  const trucks = partnerDetail && partnerDetail.trucks
  const files = partnerDetail && partnerDetail.partner_files

  const pan_files = files && files.filter(file => file.type === 'PAN')
  const cheaque_files = files && files.filter(file => file.type === 'CL')
  const agreement_files = files && files.filter(file => file.type === 'AGREEMENT')
  const cs_files = files && files.filter(file => file.type === 'CS')

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
        } else (message.error(description))
        onHide()
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

  const [checked, setChecked] = useState(false)

  const onChange = (e) => {
    setChecked(e.target.checked)
  }

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
        onboarded_by_id: form.getFieldValue('onboarded_by_id'),
        updated_by: context.email,
        partner_advance_percentage_id: form.getFieldValue('partner_advance_percentage_id'),
        onboarded_date: moment().format('YYYY-MM-DD')
      }
    })
  }

  const onCreatePartnerCodeSubmit = () => {
    setDisableButton(true)
    createPartnerCode({
      variables: {
        name: name,
        pay_terms_code: partnerDetail.partner_advance_percentage_id,
        partner_id: partner_id,
        pan_no: partnerDetail.pan,
        cardcode: get(partnerDetail, 'cardcode', null)
      }
    })
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
      <Form layout='vertical' onFinish={onCreatePartnerCodeSubmit} form={form}>
        <Row gutter={10}>
          <Col xs={24} sm={6}>
            <Form.Item name='partnerName' label='Partner Name'>
              <LinkComp
                type='partners'
                data={name}
                id={cardcode}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label='Advance Percentage'
              name='partner_advance_percentage_id'
              rules={[{ required: true }]}
              initialValue={partner_advance_percentage}
            >
              <Select placeholder='Advance Percentage' options={advancePercentageList} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={10}>
            <Form.Item
              label='On Boarded By'
              name='onboarded_by_id'
              rules={[{ required: true, message: 'On-Boarded By is required field!' }]}
              initialValue={employee}
            >
              <Select placeholder='On Boarded By' options={employeeList} optionFilterProp='label' showSearch />

            </Form.Item>
          </Col>
        </Row>
        <List header={<label>Documents</label>} bordered size='small' className='mb10'>
          <List.Item>
            <Col xs={24} sm={8}>PAN Document</Col>
            <Col xs={12} sm={12}>{partnerDetail && partnerDetail.pan}</Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
                <span>
                  {pan_files && pan_files.length > 0 ? (
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
          <List.Item>
            <Col xs={24} sm={8}>Cheque/Passbook</Col>
            <Col xs={12} sm={12}>{partnerDetail && partnerDetail.account_number}</Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
                <span>
                  {cheaque_files && cheaque_files.length > 0 ? (
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
          <List.Item>
            <Col xs={24} sm={8}>Agreement</Col>
            <Col xs={12} sm={12}>&nbsp;</Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
                <span>
                  {agreement_files && agreement_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partner_id}
                        type='partner'
                        file_type='AGREEMENT'
                        folder='approvals/'
                        file_list={agreement_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partner_id}
                        type='partner'
                        file_type='AGREEMENT'
                        file_list={agreement_files}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={partner_id}
                      type='partner'
                      folder='approvals/'
                      file_type='AGREEMENT'
                      file_list={agreement_files}
                    />
                  )}
                </span>
              </Space>
            </Col>
          </List.Item>
          <List.Item>
            <Row gutter={20}>
              <Col xs={24} sm={24}>
                <Form.Item label='Cibil Score' name='cibil'>
                  <Input placeholder='Cibil Score' />
                </Form.Item>
              </Col>
            </Row>
            <Col xs={24} sm={4} className='text-right'>
              <Space>
                <span>
                  {cs_files && cs_files.length > 0 ? (
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
          <List.Item>
            <Row gutter={20}>
              <Col xs={24} sm={24}>
                <Form.Item label='GST Applicable' name='gst'>
                  <Input placeholder='GST Number' />
                </Form.Item>
              </Col>
            </Row>
            <Col xs={12} sm={4} className='text-right'>&nbsp;</Col>
          </List.Item>
          <List.Item>
            <Col xs={24} sm={8}>
              <Checkbox checked={checked} onChange={onChange}>EMI</Checkbox>
            </Col>
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
        <br />
        <Row justify='end'>
          <Button key='submit' type='primary' loading={disableButton} htmlType='submit'>
            Approve KYC
          </Button>
        </Row>

      </Form>
    </Modal>
  )
}

export default KycApproval
