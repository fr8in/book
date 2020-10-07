import { useContext } from 'react'
import { Row, Col, Tabs, Space } from 'antd'
import LabelWithData from '../common/labelWithData'
import FileUploadOnly from '../common/fileUploadOnly'
import ViewFile from '../common/viewFile'
import DeleteFile from '../common/deleteFile'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'
import userContext from '../../lib/userContaxt'

const { TabPane } = Tabs
const PartnerDocument = (props) => {
  const { partnerInfo } = props
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]
  const access = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false

  const files = partnerInfo.partner_files

  const pan_files = files.filter(file => file.type === 'PAN')
  const cheaque_files = files.filter(file => file.type === 'CL')
  const tds_files = files.filter(file => file.type === 'TDS')
  const agreement_files = files.filter(file => file.type === 'AGREEMENT')
  const cs_files = files.filter(file => file.type === 'CS')

  return (
    <Tabs type='card' size='small'>
      <TabPane tab='Main' key='1'>
        <Row gutter={8} className='p10'>
          <Col xs={24} sm={24} md={24}>
            <LabelWithData
              label='PAN'
              data={
                <span>
                  {pan_files && pan_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='PAN'
                        folder='approvals/'
                        file_list={pan_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='PAN'
                        file_list={pan_files}
                        disable={!access}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={partnerInfo.id}
                      type='partner'
                      folder='approvals/'
                      file_type='PAN'
                      file_list={pan_files}
                      disable={!access}
                    />
                  )}
                </span>
              }
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
            <LabelWithData
              label='Cheque'
              data={
                <span>
                  {cheaque_files && cheaque_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='CL'
                        folder='approvals/'
                        file_list={cheaque_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='CL'
                        file_list={cheaque_files}
                        disable={!access}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={partnerInfo.id}
                      type='partner'
                      folder='approvals/'
                      file_type='CL'
                      file_list={cheaque_files}
                      disable={!access}
                    />
                  )}
                </span>
              }
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
            <LabelWithData
              label='TDS'
              data={
                <span>
                  {tds_files && tds_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='TDS'
                        folder='approvals/'
                        file_list={tds_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='TDS'
                        file_list={tds_files}
                        disable={!access}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={partnerInfo.id}
                      type='partner'
                      folder='approvals/'
                      file_type='TDS'
                      file_list={tds_files}
                      disable={!access}
                    />
                  )}
                </span>
              }
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
            <LabelWithData
              label='Agreement'
              data={
                <span>
                  {agreement_files && agreement_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='AGREEMENT'
                        folder='approvals/'
                        file_list={agreement_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='AGREEMENT'
                        file_list={agreement_files}
                        disable={!access}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={partnerInfo.id}
                      type='partner'
                      folder='approvals/'
                      file_type='AGREEMENT'
                      file_list={agreement_files}
                      disable={!access}
                    />
                  )}
                </span>
              }
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
            <LabelWithData
              label='Cibil Score'
              data={
                <span>
                  {cs_files && cs_files.length > 0 ? (
                    <Space>
                      <ViewFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='CS'
                        folder='approvals/'
                        file_list={cs_files}
                      />
                      <DeleteFile
                        size='small'
                        id={partnerInfo.id}
                        type='partner'
                        file_type='CS'
                        file_list={cs_files}
                        disable={!access}
                      />
                    </Space>
                  ) : (
                    <FileUploadOnly
                      size='small'
                      id={partnerInfo.id}
                      type='partner'
                      folder='approvals/'
                      file_type='CS'
                      file_list={cs_files}
                      disable={!access}
                    />
                  )}
                </span>
              }
              labelSpan={8}
              dataSpan={16}
              margin_bottom
            />
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  )
}

export default PartnerDocument
