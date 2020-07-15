import React from 'react'
import {Row, Col, Table , Input, Button } from 'antd'
import Mock from '../../../../mock/partner/comment'

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
        <Row>
         <Col><Input placeholder="Please enter comments" /></Col>
         <Col>  <Button type="primary">Submit</Button></Col>
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
