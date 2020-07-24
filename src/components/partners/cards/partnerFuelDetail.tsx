import { Row, Col, Switch } from 'antd'
import LabelWithData from '../../common/labelWithData'
import fuelDetail from '../../../../mock/card/fuelCard'

const PartnerFuelDetail = () => {
  return (
    <Row gutter={10}>
      <Col xs={24}>
        <LabelWithData
          label='Card ID'
          data={fuelDetail.id}
          labelSpan={8}
        />
        <LabelWithData
          label='Card Number'
          data={fuelDetail.cardNumber}
          labelSpan={8}
        />
        <LabelWithData
          label='Balance'
          data={fuelDetail.balance}
          labelSpan={8}
        />
        <LabelWithData
          label=' Linked Mobile'
          data={fuelDetail.mobileNo}
          labelSpan={8}
        />
        <LabelWithData
          label='Status'
          data={<Switch size='small' defaultChecked />}
          labelSpan={8}
        />
      </Col>
    </Row>
  )
}

export default PartnerFuelDetail
