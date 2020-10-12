import { Row, Col, Space } from 'antd'
import LabelWithData from '../common/labelWithData'
import AdvancePercentage from './partnerAdvancePercentage'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import EditAddress from './partnerAddress'
import EditBank from './partnerBank'
import CibilScore from '../partners/partnerCibilScore'
import Gst from '../../components/partners/partnerGst'
import Pan from './partnerPan'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import u from '../../lib/util'
import EditAccess from '../common/editAccess'

const PartnerDetail = (props) => {
  const { partnerDetail, loading } = props
  const { role } = u
  const initial = {
    address: [],
    addressVisible: false,
    bank: [],
    bankVisible: false,
    title: ''
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

  const kycStatus = get(partnerDetail, 'partner_status.name', null)
  const notVerified = kycStatus === 'Verification' || kycStatus === 'Rejected' || kycStatus === 'Registered'

  const beforeOnboard = [role.admin, role.rm, role.onboarding]
  const afterOnboard = [role.admin, role.rm]
  const editAccess = notVerified ? beforeOnboard : afterOnboard
  const ad_pm_on = [role.admin, role.partner_manager, role.onboarding]

  const address = partnerDetail && partnerDetail.address
  const partner_address = address === null || isEmpty(address) ? null
    : `${address.no || null},
         ${address.address || null},
         ${address.city || null},
         ${address.state || null},
         ${address.pin_code || null}`
  const cardcode = partnerDetail.cardcode
  console.log('addressaddress',address)
  return (
    <Row gutter={8}>
      <Col xs={24} sm={24} md={24}>
        <LabelWithData
          label='PAN'
          data={
            <Pan cardcode={cardcode} pan={partnerDetail.pan} loading={loading} edit_access={ad_pm_on} />
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='On Boarded Date'
          data={
            <Space>
              <span>{partnerDetail.onboarded_date}</span>
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' Address'
          data={
            <Space>
              <span>{partner_address}{' '}
                <EditAccess
                  edit_access={beforeOnboard}
                  onEdit={() => handleShow('addressVisible', partnerDetail, 'address', cardcode)}
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
          label='Bank'
          data={
            <span>
              {get(partnerDetail, 'bank.name', '-')}{' '}
              <EditAccess
                edit_access={editAccess}
                onEdit={() => handleShow('bankVisible', partnerDetail, 'bank', cardcode)}
              />
            </span>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Account Number '
          data={<span>{partnerDetail.display_account_number}</span>}
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
              <CibilScore cardcode={cardcode} cibil={partnerDetail.cibil} loading={loading} edit_access={ad_pm_on} />
            </span>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' TDS %'
          data={<span>{get(partnerDetail, 'tds_percentage.name', '-')}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' GST'
          data={<span><Gst cardcode={cardcode} gst={partnerDetail.gst || '-'} loading={loading} edit_access={ad_pm_on} /></span>}
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
              edit_access={ad_pm_on}
            />
          }
          labelSpan={10}
          dataSpan={14}
        />

        {object.addressVisible &&
          <EditAddress
            visible={object.addressVisible}
            cardcode={object.address}
            onHide={handleHide}
            title={object.title}
            partnerAddress={address}
          />}
        {object.bankVisible &&
          <EditBank
            visible={object.bankVisible}
            cardcode={object.bank}
            onHide={handleHide}
            title={object.title}
          />}
      </Col>
    </Row>

  )
}

export default PartnerDetail
