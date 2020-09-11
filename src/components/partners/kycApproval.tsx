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
  Table
} from 'antd'
import LinkComp from '../common/link'
import FileUploadOnly from '../common/fileUploadOnly'
import ViewFile from '../common/viewFile'
import DeleteFile from '../common/deleteFile'
import { gql, useQuery} from '@apollo/client'

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


const { Option } = Select
const tableData = [
  { truck_no: 'TN03AA0001', type: 'MXL' },
  { truck_no: 'TN03AA0002', type: 'SXL' }
]
const KycApproval = (props) => {
  const { visible, onHide, approveData } = props

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

  var employee = []
  var partner_advance_percentage = []
  if (!loading) {
    partner_advance_percentage = data.partner_advance_percentage
    employee = data.employee
  }

  const advancePercentageList = partner_advance_percentage.map((data) => {
    return { value: data.name, label: data.name }
  })
  const employeeList = employee.map((data) => {
    return { value: data.email, label: data.email }
  })

  const onSubmit = () => {
    console.log('KYC Approved', approveData)
    onHide()
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

  return (
    <Modal
      visible={visible}
      title='KYC Approval'
      onOk={onSubmit}
      onCancel={onHide}
      style={{ top: 10 }}
      bodyStyle={{ padding: 10 }}
      width={700}
      footer={[
        <Button key='back' onClick={onHide}>
            Close
        </Button>,
        <Button key='submit' type='primary' onClick={onSubmit}>
            Approve KYC
        </Button>
      ]}
    >
      <Form layout='vertical'>
        <Row gutter={10}>
          <Col xs={24} sm={10}>
            <Form.Item name='partnerName' label='Partner Name'>
              <LinkComp
                type='partners'
                data={approveData.name}
                id={approveData.cardcode}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
          <Form.Item
              label='Advance Percentage'
              name='advance_percentage'
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option options={advancePercentageList} value='Advance Percentage' > </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
          <Form.Item
              label='On Boarded By'
              name='on_boarded_by'
              rules={[{ required: true, message: 'On-Boarded By is required field!' }]}
            >
              <Select>
                <Select.Option options={employeeList} value='On Boarded By' > </Select.Option>
              </Select>
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
            <Col xs={24} sm={8}>Cibil Score</Col>
            <Col xs={12} sm={12}><Input placeholder='Cibil Score' /></Col>
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
          <List.Item>
            <Col xs={24} sm={8}>TDS</Col>
            <Col xs={12} sm={12}>
              <Radio.Group>
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
            <Col xs={24} sm={8}>GST Applicable</Col>
            <Col xs={12} sm={12}>
              <Input placeholder='GST Number' />
            </Col>
            <Col xs={12} sm={4} className='text-right'>&nbsp;</Col>
          </List.Item>
          <List.Item>
            <Col xs={24} sm={8}>
              <Checkbox>EMI</Checkbox>
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
      </Form>
    </Modal>
  )
}

export default KycApproval
