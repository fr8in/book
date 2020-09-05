import { Row, Col, Space } from 'antd'
import { EditTwoTone } from '@ant-design/icons'
import LabelWithData from '../common/labelWithData'
import AdvancePercentage from './partnerAdvancePercentage'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'
import EditAddress from './partnerAddress'
import EditBank from './partnerBank'
import CibilScore from '../partners/partnerCibilScore'
import Gst from '../../components/partners/partnerGst'
import Pan from './partnerPan'
import _ from 'lodash'

const PartnerDetail = (props) => {
  const { partnerDetail, loading } = props
  const initial = {
    address: [],
    addressVisible: false,
    bank: [],
    bankVisible: false,
    title: ''
  }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

  const address = partnerDetail && partnerDetail.address
  const partner_address = address === null || _.isEmpty(address) ? null
    : `${address.no || null},
         ${address.address || null},
         ${address.city || null},
         ${address.state || null},
         ${address.pincode || null}`
  const cardcode = partnerDetail.cardcode
  return (
    <Row gutter={8}>
      <Col xs={24} sm={24} md={24}>
        <LabelWithData
          label='PAN'
          data={
            <Pan cardcode={cardcode} pan={partnerDetail.pan} loading={loading} />
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
                <EditTwoTone onClick={() => handleShow('addressVisible', partnerDetail, 'address', cardcode)} />
              </span>
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='State'
          data={<span>{partnerDetail.city && partnerDetail.city.state && partnerDetail.city.state.name }</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Bank'
          data={
            <span>
              {_.get(partnerDetail, 'bank.name', '-')}
              <EditTwoTone onClick={() => handleShow('bankVisible', partnerDetail, 'bank', cardcode)} />
            </span>
          }
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
          data={
            <span>
              <CibilScore cardcode={cardcode} cibil={partnerDetail.cibil} loading={loading} />
            </span>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' TDS %'
          data={<span>{_.get(partnerDetail, 'tds_percentage.name', '-')}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' GST'
          data={<span><Gst cardcode={cardcode} gst={partnerDetail.gst || '-'} loading={loading} /></span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Advance Percentage'
          data={
            <AdvancePercentage
              advance={_.get(partnerDetail, 'partner_advance_percentage.name', null)}
              advance_id={_.get(partnerDetail, 'partner_advance_percentage.id', null)}
              cardcode={cardcode}
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
