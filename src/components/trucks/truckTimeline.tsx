import React from 'react';
import { DatePicker,Tooltip,Button,Row,Col,Timeline, Space} from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import CommentModal from '../../components/trucks/commentModal'
import SelectTimelineModal from '../../components/trucks/selectTimelineModal'
import EditModal from '../../components/trucks/editModal'
export default function truck(props) {


    return (
        

   <div className="ant-form-item">     

    <Row className="timelineFilter">
    <Space>
                            <DatePicker
                                showTime
                                name="startSearchDate"
                                format="YYYY-MM-DD"
                                className="startSearchdate1"
                                placeholder="Start Date"/>
        
                            <DatePicker
                                showTime
                                name="endSearchDate"
                                format="YYYY-MM-DD"
                                className="endSearchdate1"
                                placeholder="End Date"/>
                            

<Tooltip title="search">
      <Button type="primary" shape="circle" icon={<SearchOutlined />} />
    </Tooltip>
</Space>
</Row>
<br />
<Row>
    <Col>
        <Timeline >
    <Timeline.Item label="2015-09-01 09:12:11" color="green">
        <p>Waiting for load </p>
        <p> Truck Activated </p>
    </Timeline.Item>
    <Timeline.Item label="2015-09-01 09:12:11" color="red">
        <p>Breakdown </p>
        <p> Device Deactivated </p>
    </Timeline.Item>
    </Timeline>
    </Col>
    <Col>
    <CommentModal/>
    </Col>
    <Col>
    <SelectTimelineModal/>
    </Col>
    <Col>
    <EditModal/>
    </Col>
    </Row>
    </div>
)
}
  
