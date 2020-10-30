
import { Button, Card, Col, Row } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'

const Stats = (props) => {
  const { visibleStats, data, showReport, period, bgColor, last } = props
  const dataComp = (count, name, i) => {
    return (
      <div className='data' key={i}>
        <h2>{count || 0}</h2>
        <p>{name || '-'}</p>
      </div>
    )
  }
  return (
    <Card size='small' className={`stats ${bgColor} ${last ? 'last' : ''}`}>
      <Row>
        <Col flex='auto'>
          {data && data.length > 0
            ? data && data.map((val, i) => dataComp(val.count, val.name, i))
            : dataComp(0, 'null', 0)}
        </Col>
        <Col flex='85px' className='report'>
          {visibleStats &&
            <Button shape='circle' onClick={() => showReport('report')} icon={<BarChartOutlined />} />}
        </Col>
      </Row>
      {period ? <p className='period'>{period}</p> : ''}
    </Card>
  )
}

export default Stats
