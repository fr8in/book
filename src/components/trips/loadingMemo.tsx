
import { Modal, Button, Input } from 'antd'
import LinkComp from '../common/link'
import get from 'lodash/get'
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import u from '../../lib/util'


const LoadingMemo = (props) => {
  const { visible, onHide ,trip_info,tds_current_,tds_previous_} = props
  const truck_files = get(trip_info, 'truck.truck_files', null)
  const partner_files = get(trip_info, 'partner.partner_files', null)
  const loading_memo = get(trip_info,'truck.loading_memo',null)
  const truck_pan_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.partner_pan) : null
  const rc_files = !isEmpty(truck_files) ? truck_files.filter(file => file.type === u.fileType.rc) : null
  const partner_pan_files = !isEmpty(partner_files) ? partner_files.filter(file=> file.type ===  u.fileType.partner_pan) : null
  const getPartnerTDSDocument = (type, financial_year) => partner_files && partner_files.length > 0 ? partner_files.filter(data => data.type === type && data.financial_year === financial_year) : []
  const tdsYearValidation = moment(trip_info.created_at).isAfter("2020-04-01")
  const tdsYear = tdsYearValidation ? tds_current_ : tds_previous_;
  const getTruckTdsDocument = (type,financial_year) => truck_files && truck_files.length > 0 ? truck_files.filter(data => data.type === type && data.financial_year === financial_year) : []
  const partner_tds_file_list = !isEmpty(getPartnerTDSDocument( u.fileType.tds,tdsYear)) && getPartnerTDSDocument( u.fileType.tds,tdsYear).map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })
  const truck_tds_file_list = !isEmpty(getTruckTdsDocument( u.fileType.tds,tdsYear)) && getTruckTdsDocument( u.fileType.tds,tdsYear).map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })


  let text;
if(loading_memo) {
  text = rc_files.length === 0 ? "RC" :""
  text =  text.concat( truck_pan_files.length === 0 ? "PAN" : "") 
  text = text.concat(truck_tds_file_list.length === 0 ? "TDS" : "")
}
  
  return (
    <Modal
      title={'Loading Memo'}
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
        <p>Truck document required to generate loading memo</p>
        <p>{text}</p>
        <p> Please upload in 
                         {<LinkComp
                          type='trucks'
                          data={trip_info.truck.truck_no}
                          id={trip_info.truck.truck_no}
                        />}</p>
    </Modal>
  )
}

export default LoadingMemo
