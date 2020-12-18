
import ICICIBankOutgoing from '../iciciBankOutgoing'
import React, { useState } from 'react'
import { Tabs, Space, Card, Button, DatePicker, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import CashBack from '../cashBack'
import CashBackButton from '../cashBackButton'

const { RangePicker } = DatePicker

const DATE_SELECT_MUTATION = gql`
mutation icici_statement($start_date:String!,$end_date:String!) {
  icici_statement(start_date:$start_date,end_date:$end_date)
}`

const TabPane = Tabs.TabPane
const PayablesContainer = () => {
  const [dates, setDates] = useState([])
  const [tabIndex, setTabIndex] = useState("1")
  const [month, setMonth] = useState(null)
  const [year, setYear] = useState(null)

  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30
    return ((tooEarly || tooLate))
  }

  const [icici_statement] = useMutation(
    DATE_SELECT_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted(data) {
        const url = data && data.icici_statement
        window.open(url, 'icici_statement')
        message.success('Updated!!')
      }
    }
  )
  const onConfirm = () => {
    if (!isEmpty(dates)) {
      icici_statement({
        variables: {
          start_date: dates[0].format('DD-MM-YYYY'),
          end_date: dates[1].format('DD-MM-YYYY')
        }
      })
    } else {
      message.error('Select Start date and End date!')
    }
  }

  const handleMonthChange = (date, dateString) => {
    const splittedDate = dateString.split("-")
    setYear(parseInt(splittedDate[0]))
    setMonth(parseInt(splittedDate[1]))
  }
  const previousMonth = moment().subtract(1, 'months')

  const handleCashBackDate = (date) => {
    const currentDate = moment(date).subtract(1, 'months')
    return moment().diff(date, 'months') > 1 || moment().diff(date, 'months') < 1
  }


  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs
        tabBarExtraContent={
          <Space>
            {tabIndex === '0' ? <><RangePicker
              size='small'
              format='DD-MM-YYYY'
              disabledDate={(current) => disabledDate(current)}
              onCalendarChange={(value) => {
                setDates(value)
              }}
            />
              <Button size='small'>
                <DownloadOutlined onClick={() => onConfirm()} />
              </Button></> :
              <>
                <DatePicker
                  // disabledDate={(date) => handleCashBackDate(date)}
                  //defaultValue={previousMonth}
                  onChange={handleMonthChange} picker="month" />
                <CashBackButton month={month}
                  year={year} />
              </>
            }
          </Space>
        }
        defaultActiveKey={tabIndex}
        onChange={(e) => setTabIndex(e)}
      >
        <TabPane tab='ICIC Bank Outgoing' key={'0'}>
          <ICICIBankOutgoing />
        </TabPane>
        <TabPane tab='Transaction Fee' key={'1'}>
          <CashBack
            month={month}
            year={year}
          />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default PayablesContainer
