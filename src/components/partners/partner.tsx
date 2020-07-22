import React from 'react'
import { Row, Space } from 'antd'
import { CheckCircleOutlined, CrownFilled } from '@ant-design/icons'
import PartnerUsers from '../../components/partners/partnerUsers'

export default function partnerInfo () {
  return (
    <Row>
      <Space direction='horizontal'>
        <h2> <CrownFilled /> </h2>
        <h2>   <text>SAEF LOGISTICS</text> </h2>
        <h2> <CheckCircleOutlined /> </h2>
        <h4>  <text> ST563869 </text> </h4>
        <h4>  <PartnerUsers /> </h4>
      </Space>
    </Row>
  )
}

