import React from 'react'
import {Row, Col, Table , Input, Button } from 'antd'
import Mock from '../../../mock/partner/comment'

const Comment = () => {
  const columnsCurrent = [
    {
      title: 'Comment',
      dataIndex: 'comment',
    },
    {
      title: 'Created By',
      dataIndex: 'detail'
    },
    {
      title: 'Created On',
      dataIndex: 'date'
    },
  ]
  return (
   
     <div>
       <br />
        <Row>
         <Col span={8} ><Input placeholder="Please enter comments" /></Col> 
         <Col offset={1}>  <Button type="primary">Submit</Button></Col>
        </Row>
       <br />
      <Table
        columns={columnsCurrent}
        dataSource={Mock}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
     </div>
  
  )
}

export default Comment
