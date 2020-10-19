import { useContext } from 'react'
import { Row, Col, Button } from 'antd'
import BillingAndInvoiced from '../../components/trips/billingAndInvoiced'
import FileUpload from '../common/fileUpload'
import useShowHide from '../../hooks/useShowHide'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'

const TripPod = (props) => {
  const { trip_id, trip_info } = props
  const usersInitial = { billing: false }
  const { visible, onShow, onHide } = useShowHide(usersInitial)

  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.billing_manager, role.billing]
  const access = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false

  const files = get(trip_info, 'trip_files', [])
  const pod_files = !isEmpty(files) ? files.filter(file => file.type === 'POD') : null
  const pod_file_list = !isEmpty(pod_files) && pod_files.map((file, i) => {
    return ({
      uid: `${file.type}-${i}`,
      name: file.file_path,
      status: 'done'
    })
  })
  const lock = get(trip_info, 'transaction_lock', null)

  return (
    <div>
      <Row>
        <Col xs={24}>
          <Row gutter={10}>
            <Col xs={24} sm={access ? 14 : 24}>
              <FileUpload
                id={trip_id}
                type='trip'
                folder='pod/'
                file_type='POD'
                file_list={pod_file_list}
                disable={lock}
              />
            </Col>
            {access &&
              <Col xs={24} sm={10} className='text-right'>
                <Button type='primary' onClick={() => onShow('billing')} disabled={lock}>Billing</Button>
              </Col>}
          </Row>
        </Col>
      </Row>
      {visible.billing &&
        <BillingAndInvoiced
          visible={visible.billing}
          cardcode={trip_info.customer && trip_info.customer.cardcode}
          trip_id={trip_info.id}
          onHide={onHide}
        />}
    </div>
  )
}

export default TripPod
