
import ICICIBankOutgoing from '../iciciBankOutgoing'
import React, { useState } from 'react'
import { Tabs, Row, Col, Card, Input, Button, DatePicker, Space,message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { gql,useMutation} from '@apollo/client'
import moment from 'moment'

const { RangePicker } = DatePicker

const DATE_SELECT_MUTATION = gql`
mutation syncCustomeramul($start_date:String!,$end_date:String!) {
  icici_statement(start_date:$start_date,end_date:$end_date)
}`

const TabPane = Tabs.TabPane
const PayablesContainer = () => {
  const [dates, setDates] = useState([])
  
  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30
    const isNotGreaterThanToday = current && current > moment().endOf("day")
    return ( isNotGreaterThanToday || (tooEarly || tooLate) )
  }
  const [updateDate] = useMutation(
    DATE_SELECT_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted(data) {
      const url = data && data.icici_statement
      console.log('url', url) 
      window.open (url ,'icici_statement' )
      message.success('Updated!!')
     }
    }
  )  

  const onConfirm = () => { 
    updateDate({
    variables: {
      start_date: moment().format("DD-MM-YYYY"),
      end_date:moment().format("DD-MM-YYYY")
    }
  })
  }
  
  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs
        tabBarExtraContent={
          <Space>
              <Col flex='230px'>
                <RangePicker
                  size='small'
                  format='DD-MM-YYYY'
                  disabledDate={(current) => disabledDate(current)}
                  onCalendarChange={(value) => {
                    setDates(value)
                  }}
                />
              </Col>
              <Col>
                <Button size='small'>
                  <DownloadOutlined onClick={() => onConfirm() }/>
                </Button>
              </Col>
            </Space>
        }
      >
        <TabPane tab='ICIC Bank Outgoing' >
          <ICICIBankOutgoing />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default PayablesContainer
