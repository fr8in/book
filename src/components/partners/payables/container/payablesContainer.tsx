import DownPayment from '../downPayment'
import ICICIBankOutgoing from '../iciciBankOutgoing'
import StmtEmail from '../stmtMail'
import React, { useState } from 'react'
import { Tabs, Row, Col, Card, Input, Button, DatePicker, Space } from 'antd'

import { DownloadOutlined, MailOutlined } from '@ant-design/icons'
import useShowHide from '../../../../hooks/useShowHide'
const { Search } = Input
const { RangePicker } = DatePicker

const TabPane = Tabs.TabPane
const PayablesContainer = () => {
  const initial = { showModal: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const [dates, setDates] = useState([])
  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 7
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7
    return tooEarly || tooLate
  }
  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs
        tabBarExtraContent={
          <Button
            title='Add Branch'
            shape='circle'
            type='primary'
            icon={<MailOutlined />}
            onClick={() => onShow('showModal')}
          />
        }
      >
        <TabPane tab='Down Payment' key='1'>
          <Row justify='end' className='m5'>
            <Col flex='190px'>
              <Search
                size='small'
                placeholder='Search...'
                onSearch={(value) => console.log(value)}
                enterButton
              />
            </Col>
          </Row>
          <DownPayment />
        </TabPane>
        <TabPane tab='Outgoing' key='2'>
          <Row justify='end' className='m5'>
            <Col flex='190px'>
              <Search
                size='small'
                placeholder='Search...'
                onSearch={(value) => console.log(value)}
                enterButton
              />
            </Col>
          </Row>
          <DownPayment />
        </TabPane>
        <TabPane tab='Bank Transfer' key='3'>
          <Row justify='end' className='m5'>
            <Col flex='190px'>
              <Search
                size='small'
                placeholder='Search...'
                onSearch={(value) => console.log(value)}
                enterButton
              />
            </Col>
          </Row>
          <DownPayment />
        </TabPane>
        <TabPane tab='icici Bank Outgoing' key='4'>
          <Row justify='end' className='m5'>
            <Col flex='190px'>
              <Search
                size='small'
                placeholder='Search...'
                onSearch={(value) => console.log(value)}
                enterButton
              />
            </Col>
          </Row>
          <Row justify='start' className='m5'>
            <Space>
              <Col flex='230px'>
                <RangePicker
                  size='small'
                  disabledDate={disabledDate}
                  onCalendarChange={(value) => {
                    setDates(value)
                  }}
                />
              </Col>
              <Col>
                <Button size='small'>
                  <DownloadOutlined />
                </Button>
              </Col>
            </Space>
          </Row>

          <ICICIBankOutgoing />
        </TabPane>
      </Tabs>
      {visible.showModal && (
        <StmtEmail
          visible={visible.showModal}
          onHide={onHide}
        />
      )}
    </Card>
  )
}

export default PayablesContainer
