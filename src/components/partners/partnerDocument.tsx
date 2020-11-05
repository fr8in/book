import { useContext } from 'react'
import { Row, Col, Space, Form, List, message, Button } from 'antd'
import FileUploadOnly from '../common/fileUploadOnly'
import ViewFile from '../common/viewFile'
import DeleteFile from '../common/deleteFile'
import u from '../../lib/util'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import isEmpty from 'lodash/isEmpty'

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
  const edit_access = [role.admin, role.partner_manager, role.onboarding]
  const access = u.is_roles(edit_access,context)

  const files = partnerInfo.partner_files

  const pan_files = files.filter(file => file.type === u.fileType.partner_pan)
  const cheaque_files = files.filter(file => file.type === u.fileType.check_leaf)
  const tds_files = files.filter(file => file.type === u.fileType.tds)
  const agreement_files = files.filter(file => file.type === u.fileType.agreement)
  const cs_files = files.filter(file => file.type === u.fileType.cibil)

  const [reverification_approval] = useMutation(
    REVERIFICATION_APPROVAL_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )

  const _pan = !isEmpty(pan_files) ? pan_files : false
  const _check_leaf = !isEmpty(cheaque_files) ? cheaque_files : false
  const _civil = !isEmpty(cs_files) ? cs_files : false

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
          <List.Item key={2}>
            <Col xs={24} sm={8}>TDS</Col>
            <Col xs={12} sm={4} className='text-right'>
              <Space>
                <span>
                  {tds_files && tds_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type={u.fileType.tds}
                        folder={u.folder.approvals}
                        file_list={tds_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type={u.fileType.tds}
                        file_list={tds_files}
                        disable={!access}
                      />
                    </Space>
                  ) : (
                      <FileUploadOnly
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        folder={u.folder.approvals}
                        file_type={u.fileType.tds}
                        file_list={tds_files}
                        disable={!access}
                      />
                    )}
                </span>
              </Space>
            </Col>
          </List.Item>
          <List.Item key={2}>
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
          <List.Item key={4}>
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
          <Button key='submit' type='primary'htmlType='submit' disabled={!access && !_pan || !_check_leaf || !_civil}  >
            Approve KYC
                    </Button> 
        </Row>
      </Form>
    </Col>
  )
}

export default PartnerDocument
