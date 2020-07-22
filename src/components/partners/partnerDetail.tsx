import { Row, Col, Space, Checkbox, Input } from 'antd'
import LabelWithData from '../common/labelWithData'
import DetailInfo from '../../../mock/partner/partnerDetailInfo'

const PartnerDetail = () => {
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`)
  }
  return (
    <Row gutter={8}>
      <Col xs={24} sm={24} md={24}>
        <LabelWithData
          label='On Boarded Date'
          data={
            <Space>
              <span>{DetailInfo.date}</span>
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Email'
          data={
            <Space>
              <span>{DetailInfo.mail}</span>
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='No.Of Trucks'
          data={
            <Space>
              <span>{DetailInfo.truck}</span>
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' Address'
          data={
            <Space>
              <span>{DetailInfo.address}</span>
            </Space>
          }
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='State'
          data={<span>{DetailInfo.state}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Bank'
          data={<span>{DetailInfo.bank}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Account Number '
          data={<span>{DetailInfo.accNo}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='IFSC Code'
          data={<span>{DetailInfo.IFSC}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Cibil Score '
          data={<span>{DetailInfo.cibilScore}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='EMI'
          data={<Checkbox onChange={onChange} />}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' TDS %'
          data={<span>{DetailInfo.TDS}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='PAN'
          data={<span>{DetailInfo.PAN}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label=' GST'
          data={<span>{DetailInfo.GST}</span>}
          labelSpan={10}
          dataSpan={14}
        />
        <LabelWithData
          label='Mapped Customers '
          data={<Input placeholder='+ Add Customer' />}
          labelSpan={10}
          dataSpan={14}
        />
      </Col>
    </Row>

  )
}

export default PartnerDetail
