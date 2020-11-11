import { Row, Col, Space, Tooltip } from 'antd'
import LabelWithData from '../common/labelWithData'
import AdvancePercentage from './partnerAdvancePercentage'
import EditAddress from './partnerAddress'
import EditBank from './partnerBank'
import CibilScore from '../partners/partnerCibilScore'
import Gst from '../../components/partners/partnerGst'
import Pan from './partnerPan'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import u from '../../lib/util'
import EditAccess from '../common/editAccess'
import moment from 'moment'
import useShowHide from '../../hooks/useShowHide'

const PartnerDetail = (props) => {
  const { partnerDetail, loading } = props
  const { role } = u
  const initial = {
    addressVisible: false,
    bankVisible: false
  }
  const { visible, onHide, onShow } = useShowHide(initial)

  const kycStatus = get(partnerDetail, 'partner_status.name', null)
  const notVerified = kycStatus === 'Verification' || kycStatus === 'Rejected' || kycStatus === 'Registered'

  const beforeOnboard = [role.admin, role.rm, role.onboarding]
  const afterOnboard = [role.admin, role.rm,role.onboarding]
  const editAccess = notVerified ? beforeOnboard : afterOnboard
  const ad_pm_on = [role.admin, role.partner_manager, role.onboarding]

  const address = get(partnerDetail, 'address', '-')
  const partner_address = !isEmpty(address) && (typeof address === 'object') ? (
    `${address.no || null},
         ${address.address || null},
         ${address.city || null},
         ${address.state || null},
         ${address.pin_code || null}`) : address
  const cardcode = partnerDetail.cardcode

  return (
    <Row gutter={8}>
      <Col xs={24} sm={24} md={24}>
        <LabelWithData
          label='PAN'
          data={
            <Pan cardcode={cardcode} partner_id={partnerDetail.id} pan={partnerDetail.pan} loading={loading} edit_access={ad_pm_on} />
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='On Boarded Date'
          data={<span>{partnerDetail.onboarded_date ? moment(partnerDetail.onboarded_date).format('DD-MMM-YY') : '-'}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' Address'
          data={
            <Space>
              <span style={{ wordBreak: 'break-all' }}>{partner_address}{' '}
                <EditAccess
                  edit_access={beforeOnboard}
                  onEdit={() => onShow('addressVisible')}
                />
              </span>
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='State'
          data={<span>{partnerDetail.city && partnerDetail.city.state && partnerDetail.city.state.name}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Account Number '
          data={<span>{partnerDetail.display_account_number}
           <EditAccess
                edit_access={editAccess}
                onEdit={() => onShow('bankVisible')}
              />
            </span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='IFSC Code'
          data={<span>{partnerDetail.ifsc_code}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Cibil Score '
          data={
            <span>
              <CibilScore cardcode={cardcode} cibil={partnerDetail.cibil}  partner_id={partnerDetail.id} loading={loading} edit_access={ad_pm_on} />
            </span>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='TDS %'
          data={<span>{get(partnerDetail, 'tds_percentage.name', '-')}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='GST'
          data={<span><Gst cardcode={cardcode} gst={partnerDetail.gst || '-'} partner_id={partnerDetail.id} loading={loading} edit_access={ad_pm_on} /></span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Advance Percentage'
          data={
            <AdvancePercentage
              advance={get(partnerDetail, 'partner_advance_percentage.name', null)}
              advance_id={get(partnerDetail, 'partner_advance_percentage.id', null)}
              cardcode={cardcode}
              partner_id={partnerDetail.id}
              edit_access={ad_pm_on}
            />
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Status'
          data={<Tooltip title={'Id: ' + partnerDetail.id}><span>{get(partnerDetail, 'partner_status.name', '-')}</span></Tooltip>}
          labelSpan={10}
          dataSpan={14}
        />

        {visible.addressVisible &&
          <EditAddress
            visible={visible.addressVisible}
            cardcode={cardcode}
            onHide={onHide}
            partnerAddress={address}
            partner_id={partnerDetail.id}
          />}
        {visible.bankVisible &&
          <EditBank
            visible={visible.bankVisible}
            partner_id={partnerDetail.id}
            partner_info={partnerDetail}
            onHide={onHide}
          />}
      </Col>
    </Row>
  )
}

export default PartnerDetail
