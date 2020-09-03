import { Row, Col, Space, Button } from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import LabelWithData from '../common/labelWithData'
import FileUploadOnly from '../common/fileUploadOnly'
import ViewFile from '../common/viewFile'
import mockData from '../../../mock/customer/customerDetail'
import get from 'lodash/get'
import CustomerGst from './customerGst'
import CustomerOnBoardedBy from './customerOnboardedByName'

const CustomerDetails = (props) => {
  const { customer_info } = props

  const lr_files  = customer_info && customer_info.customer_files && customer_info.customer_files.filter(file => file.type === 'LR')
  const pan_files  = customer_info && customer_info.customer_files && customer_info.customer_files.filter(file => file.type === 'PAN')


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
                     file_type='PAN'
                     folder='pan/'
                     file_list={pan_files}
                   />
                 </Space>
               ) : (
                   <FileUploadOnly
                   size='small'
                     id={customer_info.id}
                     type='customer'
                     folder='pan/'
                     file_type='PAN'
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
          data={<CustomerGst gst={customer_info.gst} cardcode={customer_info.cardcode} loading={props.loading} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Virtual Account' data={customer_info.virtual_account} labelSpan={10} dataSpan={14} />
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
                    file_type='LR'
                    folder='lr/'
                    file_list={lr_files}
                  />
                </Space>
              ) : (
                  <FileUploadOnly
                  size='small'
                    id={customer_info.id}
                    type='customer'
                    folder='lr/'
                    file_type='LR'
                    file_list={lr_files}
                  />
                )}
            </span>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData label='Mobile No' data={customer_info.mobile} labelSpan={10} dataSpan={14} />
        <LabelWithData
          label='OnBoarded By'
          data={
            <CustomerOnBoardedBy
              onboardedBy={get(customer_info, 'onboarded_by.email', '-')}
              onboardedById={get(customer_info, 'onboarded_by.id', null)}
              cardcode={customer_info.cardcode}
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
