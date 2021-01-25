
import { Row, Col, Form,Checkbox,Divider,message } from 'antd'
import { useState,useContext } from 'react'
import userContext from '../../lib/userContaxt'
import FileUpload from '../common/fileUpload'
import TdsFileUpload from '../common/tdsFileUpload'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { gql,useQuery,useMutation} from '@apollo/client'
import u from '../../lib/util'
import LabelAndData from '../common/labelAndData'
import TruckPan from '../trucks/truckPan'
import InsuranceExpiry from './insuranceExpiryDateEdit'
import moment from 'moment'

const CONFIG_QUERY = gql`
query config{
  config(where:{key:{_eq:"financial_year"}}){
    value
  }
} 
`

const UPDATE_LOADING_MEMO = gql`
mutation update_loading_memo($truck_id: Int!, $updated_by: String!, $loading_memo: Boolean) {
    update_truck(_set: {loading_memo: $loading_memo, updated_by: $updated_by}, where: {id: {_eq: $truck_id}}) {
     returning {
        id
      }
   }
  }`

const truckDocuments = (props) => {
  const { truck_id, truck_info, partner_id } = props
  const { role } = u
  const edit_truck_pan = role.admin
  const context = useContext(userContext)
  const dateFormat = 'YYYY-MM-DD'

  const [checked, setChecked] = useState(truck_info.loading_memo)
  

  const [updateloadingmemo] = useMutation(
        UPDATE_LOADING_MEMO,
       {
         onError(error) {
           message.error(error.toString())
         }
     }
      )

      const onChange = (e) => {
        setChecked(e.target.checked)
                 updateloadingmemo({
                    variables: {
                        truck_id: truck_info.id,
                       loading_memo: checked  ? false : true,
                  updated_by: context.email
                      }
                 })
              }

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


  const files = get(truck_info, 'partner.partner_files', [])
  const truck_files = get(truck_info, 'truck_files', [])
  const rc_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.rc) : null
  const rc_file_list = !isEmpty(rc_files) && rc_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  const insurance_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.insurance) : null
  const insurance_file_list = !isEmpty(insurance_files) && insurance_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  const truck_pan_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.partner_pan) : null
  const truck_pan_file_list = !isEmpty(truck_pan_files) && truck_pan_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

 

  const pan_files = !isEmpty(files) ? files.filter(file => file.type === u.fileType.partner_pan) : null
  const pan_file_list = !isEmpty(pan_files) && pan_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

 
  const getPartnerTDSDocument = (type, financial_year) => files && files.length > 0 ? files.filter(data => data.type === type && data.financial_year === financial_year) : []
  const partner_tds_file_list_previous = !isEmpty(getPartnerTDSDocument( u.fileType.tds,tds_previous_)) && getPartnerTDSDocument( u.fileType.tds,tds_previous_).map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  

  const partner_tds_file_list_current = !isEmpty(getPartnerTDSDocument( u.fileType.tds,tds_current_)) && getPartnerTDSDocument( u.fileType.tds,tds_current_).map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  const getTruckTDSDocument = (type, financial_year) => !isEmpty(truck_files) ? truck_files.filter(data => data.type === type && data.financial_year === financial_year) : []
  const truck_tds_file_list_previous = !isEmpty(getTruckTDSDocument( u.fileType.tds,tds_previous_)) && getTruckTDSDocument( u.fileType.tds,tds_previous_).map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })

  const truck_tds_file_list_current = !isEmpty(getTruckTDSDocument( u.fileType.tds,tds_current_)) && getTruckTDSDocument( u.fileType.tds,tds_current_).map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })
  
  const vaahan_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.vaahan) : null
  const vaahan_file_list = !isEmpty(vaahan_files) && vaahan_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })
console.log('truck_info.loading_memo',truck_info.loading_memo)

  return (
    <div>
      <Form layout='vertical'>
      <Form.Item name='ton' className='mb0'>
          <Checkbox onChange={onChange} checked={checked}  value='value'>Use truck level document for loading memo</Checkbox>
        </Form.Item>
        <Divider />
        <Row>
        <b>Partner Documents</b>
        </Row>
        <Divider />
        <Row gutter={[10, 10]}>
        <Col xs={24} sm={6}>
            <Form.Item
              label='PAN Number'
              name='PAN'
            >
               <LabelAndData
        data={truck_info.partner.pan}
        mdSpan={4}
        smSpan={8}
        xsSpan={12}
      />
            </Form.Item>
          </Col>


          <Col xs={24} sm={6}>
            <Form.Item
              label='PAN'
              name='PAN'
              rules={[{ required: true, message: 'PAN is required field!' }]}
            >
              <FileUpload
                id={partner_id}
                type='partner'
                folder={u.folder.approvals}
                file_type={u.fileType.partner_pan}
                file_list={pan_file_list}
              />
            </Form.Item>
          </Col>

          
          <Col xs={24} sm={6}>
            <Form.Item
              label='TDS 19-20'
              name='TDS'
            >
              
              <TdsFileUpload
                id={partner_id}
                type='partner'
                folder={u.folder.approvals}
                file_type={u.fileType.tds}
                file_list={partner_tds_file_list_previous}
                financial_year={tds_previous_}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item
              label='TDS 20-21'
              name='TDS'
            >
              <TdsFileUpload
                id={partner_id}
                type='partner'
                folder={u.folder.approvals}
                file_type={u.fileType.tds}
                file_list={partner_tds_file_list_current}
                financial_year={tds_current_}
              />
            </Form.Item>
          </Col>
        </Row>
        { 
        truck_info.loading_memo === true ? (
            <>
        <Row>
        <b>Truck Documents</b>
        </Row>
        <Divider />
        <Row gutter={[10, 10]}>
        <Col xs={24} sm={6}>
            <Form.Item
              label='PAN Number'
            >
           <TruckPan  truck_id={truck_id}  pan={truck_info.pan} loading={loading} edit_access={edit_truck_pan}/>
            </Form.Item>
          </Col>
        <Col xs={24} sm={6}>
            <Form.Item
              label='PAN'
              name='PAN'
            >
              <FileUpload
                id={truck_id}
                type='truck'
                folder={u.folder.approvals}
                file_type={u.fileType.partner_pan}
                file_list={truck_pan_file_list}
              />
            </Form.Item>
          </Col>
       
        <Col xs={24} sm={6}>
            <Form.Item
              label='TDS 19-20'
              name='TDS'
            >
              
              <TdsFileUpload
                id={truck_id}
                type='truck'
                folder={u.folder.approvals}
                file_type={u.fileType.tds}
                file_list={truck_tds_file_list_previous}
                financial_year={tds_previous_}
              />
            </Form.Item>
          </Col>


          <Col xs={24} sm={6}>
            <Form.Item
              label='TDS 20-21'
              name='TDS'
            >
              <TdsFileUpload
                id={truck_id}
                type='truck'
                folder={u.folder.approvals}
                file_type={u.fileType.tds}
                file_list={truck_tds_file_list_current}
                financial_year={tds_current_}
              />
            </Form.Item>
          </Col>
        </Row>
        </>)
            : null }

        <Row gutter={[10, 10]}>
        <Col xs={24} sm={6}>
        <Form.Item 
                label='Insurance Expiry Date'
                name='insurance_expiry_at'
                rules={[{ required: true, message: 'Insurance Expiry Date is required field' }]}
                initialValue={truck_info.insurance_expiry_at ? moment(truck_info.insurance_expiry_at, dateFormat) : null}
                 >
                  <InsuranceExpiry record={truck_info} />
                </Form.Item>
                </Col>
          <Col xs={24} sm={6}>
            <Form.Item
              label='RC'
              name='RC'
              rules={[{ required: true, message: 'RC is required field!' }]}
            >
              <FileUpload
                id={truck_id}
                type='truck'
                folder={u.folder.approvals}
                file_type={u.fileType.rc}
                file_list={rc_file_list}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label='Vaahan'
              name='vaahan'
              rules={[{ required: true, message: 'Vaahan Screen is required field!' }]}
            >
              <FileUpload
                id={truck_id}
                type='truck'
                folder={u.folder.approvals}
                file_type={u.fileType.vaahan}
                file_list={vaahan_file_list}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              label='Insurance'
              name='insurance'
            >
              <FileUpload
                id={truck_id}
                type='truck'
                folder={u.folder.approvals}
                file_type={u.fileType.insurance}
                file_list={insurance_file_list}
              />
            </Form.Item>
          </Col>
          </Row>

             </Form>
    </div>
  )
}

export default truckDocuments
