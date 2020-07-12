import React from 'react'
import {Row, Col, Table , Input, Button } from 'antd'
import PageLayout from '../../layout/PageLayout'
import Mock from '../../../../mock/partner/partnerComment'

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
    <PageLayout title='Partners'>
        <Row>
         <Col><Input placeholder="Please Enter Comments" /></Col>
         <Col>  <Button type="primary">Submit</Button></Col>
        </Row>
        <Row>
      <Table
        columns={columnsCurrent}
        dataSource={Mock}
        rowKey={record => record.id}
        size='middle'
        scroll={{ x: 800, y: 400 }}
        pagination={false}
      />
      </Row>
    </PageLayout>
  )
}

export default Comment
