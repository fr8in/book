
import ICICIBankOutgoing from '../iciciBankOutgoing'
import React, { useState, useContext } from 'react'
import { Tabs, Space, Card, Button, DatePicker, message  } from 'antd';
import { DownloadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'

import isEmpty from 'lodash/isEmpty'
import CashBack from '../cashBack'
import CashBackButton from '../cashBackButton'
import u from '../../../../lib/util'
import userContext from '../../../../lib/userContaxt'
import RelianceCashBack from '../reliancecashback/RelianceCashBack';
import util from '../../../../lib/util'
import isNil from 'lodash/isNil';

const { RangePicker } = DatePicker

const DATE_SELECT_MUTATION = gql`
mutation icici_statement($start_date:String!,$end_date:String!) {
  icici_statement(start_date:$start_date,end_date:$end_date)
}`

const TabPane = Tabs.TabPane
const PayablesContainer = () => {
  const [dates, setDates] = useState([])
  const [tabIndex, setTabIndex] = useState("0")
  const [month, setMonth] = useState(null)
  const [year, setYear] = useState(null)
  const [tabIndex, setTabIndex] = useState('2')
  const [month, setMonth] = useState(null)
  const [year, setYear] = useState(null)

  const handleMonthChange = (date, dateString) => {
    const splittedDate = dateString.split("-")
    setYear(parseInt(splittedDate[0]))
    setMonth(parseInt(splittedDate[1]))
  }

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

  const getTabBarContent = () => {
    if (tabIndex === '2') {
      return <DatePicker onChange={handleMonthChange} picker="month" />
    }
    else {
      return <Space>
        <RangePicker
          size='small'
          format='DD-MM-YYYY'
          disabledDate={(current) => disabledDate(current)}
          onCalendarChange={(value) => {
            setDates(value)
          }}
        />
        <Button size='small'>
          <DownloadOutlined onClick={() => onConfirm()} />
        </Button>
      </Space>
    }

  }


  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs
        tabBarExtraContent={getTabBarContent()}
        defaultActiveKey={tabIndex}
        onChange={(e) => setTabIndex(e)}

  const handleMonthChange = (date, dateString) => {
    const splittedDate = dateString.split("-")
    setYear(parseInt(splittedDate[0]))
    setMonth(parseInt(splittedDate[1]))
  }
  const previousMonth = moment().subtract(1, 'months')

  const handleCashBackDate = (date) => {
    return moment().diff(date, 'months') > 1 || moment().diff(date, 'months') < 1
  }

  const context = useContext(userContext)
  const { role } = u

  const roles = [role.admin]
  const access = u.is_roles(roles, context)


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
                {access && <>  <DatePicker
                  disabledDate={(date) => handleCashBackDate(date)}
                  onChange={handleMonthChange} picker="month" />
                  <CashBackButton month={month}
                    year={year} /></>}
              </>
            }
          </Space>
        }
        defaultActiveKey={tabIndex}
        onChange={(e) => setTabIndex(e)}
      >
        <TabPane tab='ICICI Bank Outgoing' key={'0'}>
          <ICICIBankOutgoing />
        </TabPane>

        <TabPane tab='Reliance' key={'2'}>
        {isNil(month) || isNil(year) ?
        <> <h4 align='center'>Reliance Fuel CashBack</h4></> :
          <RelianceCashBack month={month} year={year} setMonth = {setMonth} setYear = {setYear}/> }
        </TabPane>

        {access && <TabPane tab='Transaction Fee' key={'1'}>
          <CashBack
            month={month}
            year={year}
          />
        </TabPane>}
      </Tabs>
    </Card >
  )
}

export default PayablesContainer
