import React from 'react';
import { DatePicker,Tooltip,Button,Row,Col,Timeline, Space} from 'antd';
import { SearchOutlined , CommentOutlined ,SelectOutlined ,  EditTwoTone } from '@ant-design/icons'
import CommentModal from '../../components/trucks/commentModal'
import SelectTimelineModal from '../../components/trucks/selectTimelineModal'
import EditModal from '../../components/trucks/editModal'
import useShowHide from '../../hooks/useShowHide'


const truckTimeline = () => {
const initial = {mail:false}
const {visible,onShow,onHide} = useShowHide(initial)
    return (
        

   <div className="ant-form-item">     

    <Row className="timelineFilter">
    <Space>
                            <DatePicker
                               size='small'
                                showTime
                                name="startSearchDate"
                                format="YYYY-MM-DD"
                                className="startSearchdate1"
                                placeholder="Start Date"/>
        
                            <DatePicker
                               size='small'
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
    <Space>
    <Col>
    <Button  size='small' icon={<CommentOutlined/>} onClick={() => onShow('mail')} />
    {visible.mail && <CommentModal visible={visible.mail} onHide={()=> onHide('mail')} />}
    </Col>
    <Col>
    <Button  size='small' icon={<SelectOutlined/>} onClick={() => onShow('mail')} />
    {visible.mail && <SelectTimelineModal visible={visible.mail} onHide={()=> onHide('mail')} />}
    </Col>
    <Col>
    <Button  size='small' icon={ <EditTwoTone />} onClick={() => onShow('mail')} />
    {visible.mail && <EditModal visible={visible.mail} onHide={()=> onHide('mail')} />}
    </Col>
    </Space>
    </Row>
    </div>
)
}
  
export default truckTimeline