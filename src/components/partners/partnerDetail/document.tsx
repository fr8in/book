import { Tabs, Row, Col, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import React from 'react'
const { TabPane } = Tabs;
export default function document() {
  return (
    <div>
      <br />
      <Tabs type="card">
        <TabPane tab="Main" key="1">
          <div>
            <br />
            <Row>
              <Col span={10}>
                <label><h5> PAN </h5></label>
              </Col>
              <Col span={10}>
                <UploadOutlined />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={10}>
                <label><h5>Card Number</h5></label>
              </Col>
              <Col span={10}>
                <UploadOutlined />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={10}>
                <label><h5>Balance</h5></label>
              </Col>
              <Col span={10}>
                <UploadOutlined />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={10}>
                <label><h5> Linked Mobile </h5></label>
              </Col>
              <Col span={10}>
                <UploadOutlined />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={10}>
                <label><h5> Status </h5></label>
              </Col>
              <Col span={10}>
                <UploadOutlined />
              </Col>
            </Row>
            <br />
          </div>
        </TabPane>
        <TabPane tab="Sub Company" key="2">
          <div>
            <br />
            <Row>
              <Col span={7}>
                <label><h5> Name </h5></label>
              </Col>
              <Col span={10}>
                <Input placeholder="Company Name" />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={7}>
                <label><h5>PAN</h5></label>
              </Col>
              <Col span={10}>
                <Input placeholder="PAN Number" />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={7}>
                <label><h5>Cibil Score</h5></label>
              </Col>
              <Col span={10}>
                <Input placeholder="Cibil Score" />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={7}>
                <label><h5> TDS </h5></label>
              </Col>
              <Col span={10}>
                1
					</Col>
            </Row>
            <br />
            <Row>
              <Col span={7}>
                <label><h5> Trucks </h5></label>
              </Col>
              <Col span={14}>
                <Input placeholder="Add Trucks" disabled />
              </Col>
            </Row>
            <br />
            <Row gutter={8} justify='end' className='m5'>
              <Col span={2}>
                <Input placeholder="Save" disabled />
              </Col>
            </Row>
            <br />
          </div>

        </TabPane>
      </Tabs>
    </div>
  )
}
