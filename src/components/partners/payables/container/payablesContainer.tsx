import ICICIBankOutgoing from '../iciciBankOutgoing'
import React, { useContext, useState } from 'react'
import { Button, Card, DatePicker, message, Space, Tabs } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import moment, { Moment } from 'moment'
import isEmpty from 'lodash/isEmpty'
import RelianceCashBack from '../reliancecashback/RelianceCashBack'
import u from '../../../../lib/util'
import isNil from 'lodash/isNil'
import CashBack from '../cashBack'
import CashBackButton from '../cashBackButton'
import userContext from '../../../../lib/userContaxt'
import Last48hrsPending from '../last48hrspending'

const { RangePicker } = DatePicker

const DATE_SELECT_MUTATION = gql`
mutation icici_statement($start_date:String!,$end_date:String!) {
  icici_statement(start_date:$start_date,end_date:$end_date)
}`

const TabPane = Tabs.TabPane
const PayablesContainer = () => {
  const [dates, setDates] = useState([])
  const [tabIndex, setTabIndex] = useState('0')
  const [month, setMonth] = useState(null)
  const [year, setYear] = useState(null)

  let _today = new Date()
  let today = _today;
  let day = _today.getDay()

  const handleMonthChange = (date, dateString) => {
    const splittedDate = dateString.split('-')
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
      onError(error) {
        message.error(error.toString())
      },
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

  const handleCashBackDate = (date) => {
    return moment().diff(date, 'months') > 1 || moment().diff(date, 'months') < 1
  }
  const context = useContext(userContext)
  const { role } = u

  const roles = [role.admin]
  const access = u.is_roles(roles, context)

  const fuelCashback_roles = [role.admin, role.accounts_manager, role.accounts]
  const fuelCashback_access = u.is_roles(fuelCashback_roles, context)

  const default_Value = () => {
    if (day === 6) {
      let saturday: [Moment, Moment] = [moment(today, "DD-MM-YYYY").subtract(1, "days"), moment(today, "DD/MM/YYYY").add(2, "days")];
      return saturday;
    }
    else if (day === 0) {
      let sunday: [Moment, Moment] = [moment(today,"DD-MM-YYYY").subtract(2, "days"), moment(today, "DD/MM/YYYY").add(1, "days")];
      return sunday;
    }
    else if (day === 5) {
      let friday: [Moment, Moment] = [moment(today, "DD/MM/YYYY"), moment(today, "DD/MM/YYYY").add(3, "days")];
      return friday;
    }
    else if (day === 1) {
      let monday: [Moment, Moment] = [moment(today, "DD/MM/YYYY"), moment(today, "DD/MM/YYYY").subtract(2, "days")];
      return monday;
    }
    else {
      let tuesday_thursday: [Moment, Moment] = [moment(today, "DD/MM/YYYY"), moment(today, "DD/MM/YYYY")];
      return tuesday_thursday
    }
  }

  const [start_date, setStartDate] = useState(default_Value() )
  
  const disabledendDate = (current) => {
    if (!start_date ) {
      return false
    }
    const tooLate = start_date[0] && current.diff(start_date[0], 'days') > 2 
    const tooEarly = start_date[1] && start_date[1].diff(current, 'days') > 2
    return ((tooEarly || tooLate))

  }

  const TabBarContent = () => {
    return (
      (tabIndex === '0')
        ? (
          <Space>
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
          </Space>)
        : (tabIndex === '2')
          ? (
            <Space>
              {access &&
                <Space>
                  <DatePicker
                    disabledDate={(date) => handleCashBackDate(date)}
                    onChange={handleMonthChange} picker='month'
                  />
                  <CashBackButton
                    month={month}
                    year={year}
                  />
                </Space>}
            </Space>
          )
          : (tabIndex === '1') ?
            (
              <Space>
                <RangePicker
                  size='small'
                  format='DD-MM-YYYY'
                  defaultValue={default_Value()}
                  disabledDate={(current) => disabledendDate(current)}
                  onCalendarChange={(moment) => 
                    setStartDate(moment)}
                />
                <Button size='small'>
                  <DownloadOutlined onClick={() => onConfirm()} />
                </Button>
              </Space>) :
            <DatePicker onChange={handleMonthChange} picker='month' />
    )
  }
 
  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs
        tabBarExtraContent={<TabBarContent />}
        defaultActiveKey={tabIndex}
        onChange={(e) => setTabIndex(e)}
      >
        <TabPane tab='ICICI Bank Outgoing' key='0'>
          <ICICIBankOutgoing />
        </TabPane>
        <TabPane tab='Statement' key='1'>
          <Last48hrsPending start_date={start_date}  />
        </TabPane>
        {access &&
          <TabPane tab='Transaction Fee' key='2'>
            <CashBack
              month={month}
              year={year}
            />
          </TabPane>}
        {fuelCashback_access &&
          <TabPane tab='Reliance' key='3'>
            <RelianceCashBack month={month} year={year} />
          </TabPane>}
      </Tabs>
    </Card>
  )
}

export default PayablesContainer
