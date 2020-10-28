import { Row, Col, Space, Tooltip } from 'antd'
import LabelWithData from '../common/labelWithData'
import FileUploadOnly from '../common/fileUploadOnly'
import ViewFile from '../common/viewFile'
import mockData from '../../../mock/customer/customerDetail'
import get from 'lodash/get'
import CustomerGst from './customerGst'
import CustomerOnBoardedBy from './customerOnboardedByName'
import u from '../../lib/util'
import Phone from '../common/phone'

const CustomerDetails = (props) => {
  const { customer_info } = props
  const { role } = u
  const customerGstEdit = [role.admin, role.accounts_manager, role.accounts]
  const customerOnboardedByEdit = [role.admin, role.accounts_manager, role.accounts]

  const lr_files = customer_info && customer_info.customer_files && customer_info.customer_files.filter(file => file.type === u.fileType.lr)
  const pan_files = customer_info && customer_info.customer_files && customer_info.customer_files.filter(file => file.type === u.fileType.customer_pan)
  const cus_status = (
    <Tooltip title={get(customer_info, 'id', '-')}>{get(customer_info, 'status.name', '-')}</Tooltip>
  )
  return (
    <Row gutter={8}>
      <Col xs={24} sm={24} md={12}>
        <LabelWithData
          label='PAN'
          data={
            <span>
              {pan_files && pan_files.length > 0 ? (
                <Space>
                  <ViewFile
                    size='small'
                    id={customer_info.id}
                    type='customer'
                    file_type={u.fileType.customer_pan}
                    folder={u.folder.customer_pan}
                    file_list={pan_files}
                  />
                </Space>
              ) : (
                <FileUploadOnly
                  size='small'
                  id={customer_info.id}
                  type='customer'
                  folder={u.folder.customer_pan}
                  file_type={u.fileType.customer_pan}
                  file_list={pan_files}
                />
              )}
            </span>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='GST No'
          data={<CustomerGst gst={customer_info.gst} cardcode={customer_info.cardcode} loading={props.loading} edit_access={customerGstEdit} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Virtual Account' data={customer_info.virtual_account} labelSpan={10} dataSpan={14} />
        <LabelWithData label='Status' data={cus_status} labelSpan={10} dataSpan={14} />
      </Col>
      <Col xs={24} sm={24} md={12}>
        <LabelWithData
          label='LR'
          data={
            <span>
              {lr_files && lr_files.length > 0 ? (
                <Space>
                  <ViewFile
                    size='small'
                    id={customer_info.id}
                    type='customer'
                    file_type={u.fileType.lr}
                    folder={u.folder.customer_lr}
                    file_list={lr_files}
                  />
                </Space>
              ) : (
                <FileUploadOnly
                  size='small'
                  id={customer_info.id}
                  type='customer'
                  folder={u.folder.customer_lr}
                  file_type={u.fileType.lr}
                  file_list={lr_files}
                />
              )}
            </span>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Mobile No' data={<Phone number={customer_info.mobile} />} labelSpan={10} dataSpan={14} />
        <LabelWithData
          label='OnBoarded By'
          data={
            <CustomerOnBoardedBy
              onboardedBy={get(customer_info, 'onboarded_by.email', '-')}
              onboardedById={get(customer_info, 'onboarded_by.id', null)}
              cardcode={customer_info.cardcode}
              edit_access={customerOnboardedByEdit}
            />
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Receivable Days' data={mockData.receivableDays} labelSpan={10} dataSpan={14} />
      </Col>
    </Row>
  )
}

export default CustomerDetails
