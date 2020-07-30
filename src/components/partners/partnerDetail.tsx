import { Row, Col, Space } from 'antd'
import {EditTwoTone} from '@ant-design/icons'
import LabelWithData from '../common/labelWithData'
import DetailInfo from '../../../mock/partner/partnerDetailInfo'
import AdvancePercentage from './partnerAdvancePercentage'
import detailInfo from '../../../mock/partner/partnerDetailInfo'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import EditAddress from './editAddress'
import EditBank from './editBank'

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

  return (
    <Row gutter={8}>
      <Col xs={24} sm={24} md={24}>
        <LabelWithData
          label='PAN'
          data={partnerDetail.pan}
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
              <span>{partnerDetail.address}<EditTwoTone  onClick={() => handleShow('addressVisible', partnerDetail, 'address', partnerDetail.cardcode)}/></span>
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
          data={<span>{partnerDetail.bank && partnerDetail.bank.name}<EditTwoTone  onClick={() => handleShow('bankVisible', partnerDetail, 'bank', partnerDetail.cardcode)}/></span>}
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
          data={<span>{partnerDetail.cibil}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' TDS %'
          data={<span>{partnerDetail.tds_percentage &&  partnerDetail.tds_percentage.value ? 
            partnerDetail.tds_percentage.value : '-'}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' GST'
          data={<span>{partnerDetail.gst}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Advance Percentage'
          data={
            <AdvancePercentage
            advance={partnerDetail.partner_advance_percentage && partnerDetail.partner_advance_percentage.value }
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
          data={object.address}
          onHide={handleHide}
          title={object.title}
        />}
        {object.bankVisible &&
        <EditBank
          visible={object.bankVisible}
          data={object.bank}
          onHide={handleHide}
          title={object.title}
        />}
      </Col>
    </Row>

  )
}

export default PartnerDetail
