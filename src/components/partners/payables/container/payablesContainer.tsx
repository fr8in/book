import ICICIBankOutgoing from '../iciciBankOutgoing'
import React, { useContext, useState } from 'react'
import { Button, Card, DatePicker, message, Space, Tabs } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import RelianceCashBack from '../reliancecashback/RelianceCashBack'
import u from '../../../../lib/util'
import CashBack from '../cashBack'
import CashBackButton from '../cashBackButton'
import userContext from '../../../../lib/userContaxt'
import Last7daysPending from '../last7daysPending'


const { RangePicker } = DatePicker

const DATE_SELECT_MUTATION = gql`
mutation icici_statement($start_date:String!,$end_date:String!) {
  icici_statement(start_date:$start_date,end_date:$end_date)
}`

const TabPane = Tabs.TabPane
const PayablesContainer = () => {
  const [tabIndex, setTabIndex] = useState('0')
  const [month, setMonth] = useState(null)
  const [year, setYear] = useState(null)
  const [dates, setDates] = useState([])
  const initial = { loading: false }
  const [disableBtn, setDisableBtn] = useState(initial)
  const context = useContext(userContext)
  const { role } = u

  const roles = [role.admin]
  const access = u.is_roles(roles, context)

  const fuelCashback_roles = [role.admin, role.accounts_manager, role.accounts]
  const fuelCashback_access = u.is_roles(fuelCashback_roles, context)

  let today = new Date()
  let day = today.getDay()

  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30
    return ((tooEarly || tooLate))
  }  
   const handleMonthChange = (date, dateString) => {
    const splittedDate = dateString.split('-')
    setYear(parseInt(splittedDate[0]))
    setMonth(parseInt(splittedDate[1]))
  }

  function disabledMonthForFuelCashBack(current) {
    return current && current < moment("2020/11/01") || current > moment();
  }

  const [icici_statement] = useMutation(
    DATE_SELECT_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
        setDisableBtn(disableBtn)
      },
      onCompleted (data) {
        setDisableBtn(initial)
        const url = data && data.icici_statement
        window.open(url, 'icici_statement')
        message.success('Download!!')
      }
    }
  )


  const handleCashBackDate = (date) => {
    return moment().diff(date, 'months') > 1 || moment().diff(date, 'months') < 1
  }


  let saturday = 6;
  let friday = 5
  let sunday = 0;
  let monday = 1
  let current_date = [moment(today, "DD-MM-YYYY"), moment(today, "DD/MM/YYYY")]

  const _day = (day === saturday) ? [current_date[1].add(2, "days"), current_date[0].subtract(1, "days")]
    : (day === friday) ? [current_date[1].add(3, "days"), current_date[0]]
      : (day === sunday) ? [current_date[1].add(1, "days"), current_date[0].subtract(2, "days")]
        : (day === monday) ? [current_date[1].subtract(2, "days"), current_date[0]]
          : [current_date[1], current_date[0].subtract(2, "days")]

  const [date, setDate] = useState([_day[1], _day[0]])
  
  const onConfirm = () => {
    if (!isEmpty(dates)) {
      setDisableBtn({ ...disableBtn, loading: true })
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
  const TabBarContent = () => {
    return (
      (tabIndex === '0') ?
      (
        <Space>
          <RangePicker
            size='small'
            format='DD-MM-YYYY'
            disabledDate={(current) => disabledDate(current)}
            onCalendarChange={(value) => {
              setDates(value)
            }}
          />
          <Button size='small' loading={disableBtn.loading} >
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
          : (tabIndex === '3') ?
            <DatePicker onChange={handleMonthChange} picker='month'
              disabledDate={(current) => disabledMonthForFuelCashBack(current)} />
            : (tabIndex === '4') ? <DatePicker /> : null
    )
  }

  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs
        tabBarExtraContent={TabBarContent()}
        defaultActiveKey={tabIndex}
        onChange={(e) => setTabIndex(e)}
      >
        <TabPane tab='ICICI Bank Outgoing' key='0'>
          <ICICIBankOutgoing />
        </TabPane>
        <TabPane tab='Statement' key='1'>
          <Last7daysPending />
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
        <TabPane tab="Sourcing Incentive" key="4">

        </TabPane>
      </Tabs>
    </Card>
  )
}

export default PayablesContainer
