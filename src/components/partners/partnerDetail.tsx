import { Row, Col, Space } from 'antd'
import {EditTwoTone} from '@ant-design/icons'
import LabelWithData from '../common/labelWithData'
import DetailInfo from '../../../mock/partner/partnerDetailInfo'
import AdvancePercentage from './partnerAdvancePercentage'
import detailInfo from '../../../mock/partner/partnerDetailInfo'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import EditAddress from './partnerAddress'
import EditBank from './partnerBank'
import CibilScore from '../partners/partnerCibilScore'
import Gst from '../../components/partners/partnerGst'
import Pan from './partnerPan'

const PartnerDetail = (props) => {
  const { partnerDetail } = props
  const initial = {
    address: [],
    addressVisible: false,
    bank: [],
    bankVisible: false,
    title: ''
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

  console.log('partnerDetail', partnerDetail)

const no = partnerDetail.address && partnerDetail.address.no
const address = partnerDetail.address && partnerDetail.address.address
const city = partnerDetail.address && partnerDetail.address.city
const state = partnerDetail.address && partnerDetail.address.state
const pincode = partnerDetail.address && partnerDetail.address.pincode
const partner_address =no && no.concat(address,city,state,pincode)
  return (
    <Row gutter={8}>
      <Col xs={24} sm={24} md={24}>
        <LabelWithData
          label='PAN'
          data={
            <Pan cardcode={partnerDetail.cardcode} pan={partnerDetail.pan} />
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
              <span>{partner_address}
              <EditTwoTone  onClick={() => handleShow('addressVisible', partnerDetail, 'address', partnerDetail.cardcode)}/></span>
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='State'
          data={<span>{detailInfo.state}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Bank'
          data={<span>{partnerDetail.bank && partnerDetail.bank.name}
          <EditTwoTone  onClick={() => handleShow('bankVisible', partnerDetail, 'bank', partnerDetail.cardcode)}/></span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Account Number '
          data={<span>{partnerDetail.account_number}</span>}
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
          data={<span><CibilScore cardcode={partnerDetail.cardcode} cibil={partnerDetail.cibil} />
          </span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' TDS %'
          data={<span>{partnerDetail.tds_percentage &&  partnerDetail.tds_percentage.name ? 
            partnerDetail.tds_percentage.name : '-'}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' GST'
          data={<span><Gst cardcode={partnerDetail.cardcode} gst={partnerDetail.gst} /></span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Advance Percentage'
          data={
            <AdvancePercentage
            advance={partnerDetail.partner_advance_percentage && partnerDetail.partner_advance_percentage.name }
            advanceId={partnerDetail.partner_advance_percentage && partnerDetail.partner_advance_percentage.id }
            cardcode={partnerDetail.cardcode}
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
