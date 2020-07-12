import React from 'react'
import { Button, Card, Col, Row } from 'antd'
import { BarChartOutlined, InsertRowAboveOutlined } from '@ant-design/icons'

const Stats = (props) => {
  const { visibleStats, visibleOrders, data, showReport, period, bgColor } = props
  const dataComp = (count, name, i) => {
    return (
      <div className='data' key={i}>
        <h2>{count}</h2>
        <p>{name}</p>
      </div>
    )
  }
  return (
    <Card size='small' className={`stats ${bgColor}`}>
      <Row>
        <Col flex='auto'>
          {data && data.length > 0
            ? data && data.map((val, i) => dataComp(val.count, val.name, i))
            : dataComp(0, 'null', 0)}
        </Col>
        <Col flex='85px' className='report'>
          {visibleOrders &&
            <Button shape='circle' onClick={() => showReport('orders')} icon={<InsertRowAboveOutlined />} />}
          {visibleStats &&
            <Button shape='circle' onClick={() => showReport('report')} icon={<BarChartOutlined />} />}
        </Col>
      </Row>
      {period ? <p className='period'>{period}</p> : ''}
    </Card>
  )
}

export default Stats
