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
  Table,
  message
} from 'antd'
import LinkComp from '../common/link'
import FileUploadOnly from '../common/fileUploadOnly'
import ViewFile from '../common/viewFile'
import DeleteFile from '../common/deleteFile'
import { gql, useQuery,useMutation} from '@apollo/client'
import { useState } from 'react'
import get from 'lodash/get'

const PARTNERS_SUBSCRIPTION = gql`
  query create_partner{
    employee{
      id
      email
    }
    partner_advance_percentage{
      id
      name
    }
}
`

const UPDATE_PARTNER_APPOVAL_MUTATION = gql`
mutation($onboarded_by_id:Int,$partner_advance_percentage_id:Int,$gst:String,$cibil:String,$emi:Boolean,$id:Int,$partner_status_id:Int){
  update_partner(_set: {onboarded_by_id:$onboarded_by_id, partner_advance_percentage_id:$partner_advance_percentage_id, gst:$gst, cibil:$cibil, emi:$emi,partner_status_id:$partner_status_id}, where: {id: {_eq:$id}}) {
    returning {
      id
    }
  }
}
`

const CREATE_PARTNER_CODE_MUTATION = gql`
mutation create_partner_code($name: String!, $partner_id: Int!, $pay_terms_code: Int!) {
  create_partner_code(name: $name, partner_id: $partner_id, pay_terms_code: $pay_terms_code) {
    description
    status
  }
}
`

const { Option } = Select
const tableData = [
  { truck_no: 'TN03AA0001', type: 'MXL' },
  { truck_no: 'TN03AA0002', type: 'SXL' }
]
const KycApproval = (props) => {
  const { visible, onHide, approveData } = props
  const [form] = Form.useForm()

  const files = approveData.partner_files
  const pan_files = files.filter(file => file.type === 'PAN')

  const cheaque_files = files.filter(file => file.type === 'CL')

  const tds_files = files.filter(file => file.type === 'TDS')

  const agreement_files = files.filter(file => file.type === 'AGREEMENT')

  const cs_files = files.filter(file => file.type === 'CS')

  const { loading, error, data } = useQuery(
    PARTNERS_SUBSCRIPTION,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('CreatePartnersContainer error', error)

  const [updatePartnerApproval] = useMutation(
    UPDATE_PARTNER_APPOVAL_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  const [createPartnerCode] = useMutation(
    CREATE_PARTNER_CODE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const status = get(data, 'create_partner_code.status', null)
        const description = get(data, 'create_partner_code.description', null)
        if (status === 'OK') {
          message.success(description || 'Code created!')
          onPartnerApprovalSubmit()
        } else (message.error(description))
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

  const onChange = e => {
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
      dataIndex: 'type'
    }
  ]

  const onPartnerApprovalSubmit = () => {
    console.log('Traffic Added',approveData.id)
    updatePartnerApproval({
      variables: {
        id: approveData.id,
        partner_status_id: 4,
        gst: form.getFieldValue('gst'),
        cibil:form.getFieldValue('cibil'),
        onboarded_by_id: form.getFieldValue('onboarded_by_id'),
        partner_advance_percentage_id:form.getFieldValue('partner_advance_percentage_id')
      }
    })
  }

  const onCreatePartnerCodeSubmit = () => {
    console.log('Traffic Added',approveData.id)
    createPartnerCode({
      variables: {
        name: approveData.name,
        pay_terms_code: approveData.partner_advance_percentage_id,
        partner_id: approveData.id
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
      <Form layout='horizontal' onFinish={onCreatePartnerCodeSubmit} form={form}>
        <Row gutter={10}>
          <Col xs={24} sm={6}>
            <Form.Item name='partnerName' label='Partner Name'>
              <LinkComp
                type='partners'
                data={approveData.name}
                id={approveData.cardcode}
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
              <Select placeholder='Advance Percentage' options={advancePercentageList}/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={10}>
          <Form.Item
              label='On Boarded By'
              name='onboarded_by_id'
              rules={[{ required: true, message: 'On-Boarded By is required field!' }]}
              initialValue={employee}
            >
              <Select placeholder='On Boarded By' options={employeeList}/>
                
            </Form.Item>
          </Col>
        </Row>
        <List header={<label>Documents</label>} bordered size='small' className='mb10'>
          <List.Item>
            <Col xs={24} sm={8}>PAN Document</Col>
            <Col xs={12} sm={12}>{approveData.pan}</Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
              <span>
                  {pan_files && pan_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={approveData.id}
                        type='partner'
                        file_type='PAN'
                        folder='approvals/'
                        file_list={pan_files}
                      />
                      <DeleteFile
                        size='small'
                        id={approveData.id}
                        type='partner'
                        file_type='PAN'
                        file_list={pan_files}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={approveData.id}
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
            <Col xs={12} sm={12}>{approveData.accNo}</Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
              <span>
                  {cheaque_files && cheaque_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={approveData.id}
                        type='partner'
                        file_type='CL'
                        folder='approvals/'
                        file_list={cheaque_files}
                      />
                      <DeleteFile
                        size='small'
                        id={approveData.id}
                        type='partner'
                        file_type='CL'
                        file_list={cheaque_files}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={approveData.id}
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
                        id={approveData.id}
                        type='partner'
                        file_type='Agreement'
                        folder='approvals/'
                        file_list={agreement_files}
                      />
                      <DeleteFile
                        size='small'
                        id={approveData.id}
                        type='partner'
                        file_type='Agreement'
                        file_list={agreement_files}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={approveData.id}
                      type='partner'
                      folder='approvals/'
                      file_type='Agreement'
                      file_list={agreement_files}
                    />
                  )}
                </span>
              </Space>
            </Col>
          </List.Item>
          <List.Item>
          <Row gutter={20} >
          <Col xs={24} sm={24}> 
            <Form.Item label='Cibil Score' name='cibil'>
            <Input placeholder='Cibil Score' />
            </Form.Item>
            </Col>
            </Row>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
              <span>
                  {cs_files && cs_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={approveData.id}
                        type='partner'
                        file_type='CS'
                        folder='approvals/'
                        file_list={cs_files}
                      />
                      <DeleteFile
                        size='small'
                        id={approveData.id}
                        type='partner'
                        file_type='CS'
                        file_list={cs_files}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={approveData.id}
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
          <List.Item >
            <Col xs={24} sm={8}>TDS</Col>
            <Col xs={12} sm={12}>
              <Radio.Group  >
                <Radio value='Applicable'>Applicable</Radio>
                <Radio value='notApplicable'>Not Applicable</Radio>
              </Radio.Group>
            </Col>
         
            <Col xs={12} sm={4} className='text-right'>
            <span>
                  {tds_files && tds_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={approveData.id}
                        type='partner'
                        file_type='TDS'
                        folder='approvals/'
                        file_list={tds_files}
                      />
                      <DeleteFile
                        size='small'
                        id={approveData.id}
                        type='partner'
                        file_type='TDS'
                        file_list={tds_files}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={approveData.id}
                      type='partner'
                      folder='approvals/'
                      file_type='TDS'
                      file_list={tds_files}
                    />
                  )}
                </span> 
            </Col> 
          </List.Item>
          <List.Item>
          <Row gutter={20} >
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
          dataSource={tableData}
          size='small'
          pagination={false}
        />
         <Button key='back' onClick={onHide}>
            Close
        </Button>,
        <Button key='submit' type='primary' htmlType='submit'>
            Approve KYC
        </Button>
      </Form>
    </Modal>
  )
}

export default KycApproval
