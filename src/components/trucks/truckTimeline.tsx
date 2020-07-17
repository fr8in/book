import React from 'react';
import { DatePicker,Tooltip,Button,Row,Col,Timeline, Space} from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';

export default function truck(props) {
    return (

   <div>     

<Row className="m5">
    <Space>
    <DatePicker defaultValue={moment('Start Date', dateFormat)} format={dateFormat} />
  
  
  
    <DatePicker defaultValue={moment('End Date', dateFormat)} format={dateFormat} />
  
  

<Tooltip title="search">
      <Button type="primary" shape="circle" icon={<SearchOutlined />} />
    </Tooltip>
</Space>
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
  
