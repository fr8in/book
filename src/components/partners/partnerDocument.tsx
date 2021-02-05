import { useContext } from 'react'
import { Row, Col, Space, Form, List, message, Button } from 'antd'
import FileUploadOnly from '../common/fileUploadOnly'
import TdsFileUploadOnly from '../common/tdsFileUploadOnly'
import ViewFile from '../common/viewFile'
import DeleteFile from '../common/deleteFile'
import u from '../../lib/util'
import { gql, useMutation ,useQuery} from '@apollo/client'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const CONFIG_QUERY = gql`
query config{
  config(where:{key:{_eq:"financial_year"}}){
    value
  }
} 
`

const REVERIFICATION_APPROVAL_MUTATION = gql`
mutation($id:Int){
  update_partner(_set: {partner_status_id: 4}, where: {id: {_eq:$id}}) {
    returning {
      id
    }
  }
}
`

const PartnerDocument = (props) => {
  const { partnerInfo } = props
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding, role.rm]
  const access = u.is_roles(edit_access,context)

  const files = partnerInfo.partner_files

  const pan_files = files.filter(file => file.type === u.fileType.partner_pan)
  const cheaque_files = files.filter(file => file.type === u.fileType.check_leaf)
  const getTDSDocument = (type, financial_year) => files && files.length > 0 ? files.filter(data => data.type === type && data.financial_year === financial_year) : []
  const agreement_files = files.filter(file => file.type === u.fileType.agreement)
  const cs_files = files.filter(file => file.type === u.fileType.cibil)

  const Reverification = partnerInfo.partner_status.name === 'Reverification' 

  const { loading, error, data } = useQuery(CONFIG_QUERY, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  console.log('Partner Documents error',error)

  let config_data = {}
  if (!loading) {
    config_data = data
  }
 
  const tds_current_ = get(config_data, 'config[0].value.current', null)
  const tds_previous_ = get(config_data, 'config[0].value.previous', null)

  console.log('tds_current_',getTDSDocument(u.fileType.tds,2021))
  
  const [reverification_approval] = useMutation(
    REVERIFICATION_APPROVAL_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )

  const _pan = !isEmpty(pan_files) ? pan_files : false
  const _check_leaf = !isEmpty(cheaque_files) ? cheaque_files : false
  const _cibil = !isEmpty(cs_files) ? cs_files : false

  const onDelete = () => {
    reverification_approval({
      variables: {
        id: partnerInfo.id
      }
    })
  }
  return (
    <Col xs={24} sm={24}>
      <Form layout='vertical' onFinish={onDelete} >
        <List bordered size='small' className='mb10'>
          <List.Item key={1}>
            <Col xs={24} sm={8}>PAN </Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
                <span>
                  {pan_files && pan_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type={u.fileType.partner_pan}
                        folder={u.folder.approvals}
                        file_list={pan_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type={u.fileType.partner_pan}
                        file_list={pan_files}
                        disable={!access}
                      />
                    </Space>
                  ) : (
                      <FileUploadOnly
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        folder={u.folder.approvals}
                        file_type={u.fileType.partner_pan}
                        file_list={pan_files}
                        disable={!access}
                      />
                    )}
                </span>
              </Space>
            </Col>
          </List.Item>
          <List.Item key={2}>
            <Col xs={24} sm={8}>Cheque</Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
                <span>
                  {cheaque_files && cheaque_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type={u.fileType.check_leaf}
                        folder={u.folder.approvals}
                        file_list={cheaque_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type={u.fileType.check_leaf}
                        file_list={cheaque_files}
                        disable={!access}
                      />
                    </Space>
                  ) : (
                      <FileUploadOnly
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        folder={u.folder.approvals}
                        file_type={u.fileType.check_leaf}
                        file_list={cheaque_files}
                        disable={!access}
                      />
                    )}
                </span>
              </Space>
            </Col>
          </List.Item>
          <List.Item key={3}>
                      <Col xs={24} sm={8}>TDS 19-20</Col>
                      <Col xs={12} sm={4} className='text-right'>
                        <Space>
                          <span>
                            {!isEmpty(getTDSDocument(u.fileType.tds,tds_previous_))  ? (
                              <Space>
                                <ViewFile
                                  size='small'
                                  id={partnerInfo.id}
                                  type='partner'
                                  file_type={u.fileType.tds}
                                  folder={u.folder.approvals}
                                  file_list={getTDSDocument(u.fileType.tds,tds_previous_)}
                                />
                                <DeleteFile
                                  size='small'
                                  id={partnerInfo.id}
                                  type='partner'
                                  file_type={u.fileType.tds}
                                  file_list={getTDSDocument(u.fileType.tds,tds_previous_)}
                                />
                              </Space>
                            ) :  (
                              <TdsFileUploadOnly
                                size='small'
                                id={partnerInfo.id}
                                type='partner'
                                folder={u.folder.approvals}
                                file_type={u.fileType.tds}
                                file_list={getTDSDocument(u.fileType.tds,tds_previous_)}
                                financial_year={tds_previous_}
                              />
                            )}
                          </span>
                        </Space>
                      </Col>
                    </List.Item>
                    <List.Item key={4}>
                      <Col xs={24} sm={8}>TDS 20-21</Col>
                      <Col xs={12} sm={4} className='text-right'>
                        <Space>
                          <span>
                            {!isEmpty(getTDSDocument(u.fileType.tds,tds_current_)) ? (
                              <Space>
                                <ViewFile
                                  size='small'
                                  id={partnerInfo.id}
                                  type='partner'
                                  file_type={u.fileType.tds}
                                  folder={u.folder.approvals}
                                  file_list={getTDSDocument(u.fileType.tds,tds_current_)}
                                />
                                <DeleteFile
                                  size='small'
                                  id={partnerInfo.id}
                                  type='partner'
                                  file_type={u.fileType.tds}
                                  file_list={getTDSDocument(u.fileType.tds,tds_current_)}
                                />
                              </Space>
                            ) :  (
                              
                              <TdsFileUploadOnly
                                size='small'
                                id={partnerInfo.id}
                                type='partner'
                                folder={u.folder.approvals}
                                file_type={u.fileType.tds}
                                file_list={getTDSDocument(u.fileType.tds,tds_current_)}
                                financial_year={tds_current_}
                              />
                            )}
                          </span>
                        </Space>
                      </Col>
                    </List.Item>
          <List.Item key={5}>
            <Col xs={24} sm={8}>Agreement</Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
                <span>
                  {agreement_files && agreement_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type={u.fileType.agreement}
                        folder={u.folder.approvals}
                        file_list={agreement_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type={u.fileType.agreement}
                        file_list={agreement_files}
                        disable={!access}
                      />
                    </Space>
                  ) : (
                      <FileUploadOnly
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        folder={u.folder.approvals}
                        file_type={u.fileType.agreement}
                        file_list={agreement_files}
                        disable={!access}
                      />
                    )}
                </span>
              </Space>
            </Col>
          </List.Item>
          <List.Item key={6}>
            <Col xs={24} sm={20}>
              <Row>
                <Col xs={10}>Cibil Score</Col>
              </Row>
            </Col>
            <Col xs={24} sm={4} className='text-right'>
              <Space>
                <span>
                  {cs_files && cs_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type={u.fileType.cibil}
                        folder={u.folder.approvals}
                        file_list={cs_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type={u.fileType.cibil}
                        file_list={cs_files}
                        disable={!access}
                      />
                    </Space>
                  ) : (
                      <FileUploadOnly
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        folder={u.folder.approvals}
                        file_type={u.fileType.cibil}
                        file_list={cs_files}
                        disable={!access}
                      />
                    )}
                </span>
              </Space>
            </Col>
          </List.Item>
        </List>
        <Row justify='end' className='mt10'>
          <Button key='submit' type='primary'htmlType='submit' disabled={!access || !_pan || !_check_leaf || !_cibil || !Reverification}  >
          Reverification
                    </Button> 
        </Row>
      </Form>
    </Col>
  )
}

export default PartnerDocument
