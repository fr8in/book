import React from 'react';
import { DatePicker,Tooltip,Button,Row,Col,Timeline} from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';

export default function truck(props) {
    return (

   <div>     

<Row>
    <Col>
    <DatePicker defaultValue={moment('Start Date', dateFormat)} format={dateFormat} />
  </Col>
  
  <Col>
    <DatePicker defaultValue={moment('End Date', dateFormat)} format={dateFormat} />
  </Col>
  
<Col>
<Tooltip title="search">
      <Button type="primary" shape="circle" icon={<SearchOutlined />} />
    </Tooltip>
</Col>
</Row>
<br />
<Row>
    <Col>
        <Timeline>
    <Timeline.Item color="green">
        <p>Waiting for load </p>
        <p> Truck Activated </p>
    </Timeline.Item>
    <Timeline.Item color="red">
        <p>Breakdown </p>
        <p> Device Deactivated </p>
    </Timeline.Item>
    </Timeline>
    </Col>
    </Row>
    </div>
)
}
  
