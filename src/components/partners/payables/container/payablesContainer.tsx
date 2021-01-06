import ICICIBankOutgoing from '../iciciBankOutgoing'
import React, { useContext, useState } from 'react'
import { Button, Card, DatePicker, message, Space, Tabs, Form } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import moment from 'moment'
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
  const [tabIndex, setTabIndex] = useState('0')
  const [month, setMonth] = useState(null)
  const [year, setYear] = useState(null)
  const initial = { loading: false }
  const [disableBtn, setDisableBtn] = useState(initial)
  let _today = new Date()
  let today = _today;
  let day = _today.getDay()

  const handleMonthChange = (date, dateString) => {
    const splittedDate = dateString.split('-')
    setYear(parseInt(splittedDate[0]))
    setMonth(parseInt(splittedDate[1]))
  }

  const [icici_statement] = useMutation(
    DATE_SELECT_MUTATION,
    {
      onError(error) {
        message.error(error.toString())
        setDisableBtn(disableBtn)
      },
      onCompleted(data) {
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
  const context = useContext(userContext)
  const { role } = u

  const roles = [role.admin]
  const access = u.is_roles(roles, context)

  const fuelCashback_roles = [role.admin, role.accounts_manager, role.accounts]
  const fuelCashback_access = u.is_roles(fuelCashback_roles, context)

  const date = (day === 6) ? [moment(today, "DD-MM-YYYY").subtract(1, "days"), moment(today, "DD/MM/YYYY").add(2, "days")]
    : (day === 5) ? [moment(today, "DD/MM/YYYY"), moment(today, "DD/MM/YYYY").add(3, "days")]
      : (day === 4) ? [moment(today, "DD/MM/YYYY").subtract(2, "days"), moment(today, "DD/MM/YYYY")]
        : (day === 3) ? [moment(today, "DD/MM/YYYY").subtract(2, "days"), moment(today, "DD/MM/YYYY")]
          : (day === 2) ? [moment(today, "DD/MM/YYYY").subtract(2, "days"), moment(today, "DD/MM/YYYY")]
            : (day === 1) ? [moment(today, "DD/MM/YYYY"), moment(today, "DD/MM/YYYY").subtract(2, "days")]
              : (day === 0) ? [moment(today, "DD-MM-YYYY").subtract(2, "days"), moment(today, "DD/MM/YYYY").add(1, "days")]
                : [moment(today, "DD/MM/YYYY"), moment(today, "DD/MM/YYYY")]

  console.log('date', date, typeof date)

  const [start_date, setStartDate] = useState([])
  console.log('start_date', start_date)
  const disabledendDate = (current) => {
    if (!start_date) {
      return false
    }
    const tooLate = start_date[0] && current.diff(start_date[0], 'days') > 30
    const tooEarly = start_date[1] && start_date[1].diff(current, 'days') > 30
    return ((tooLate || tooEarly))

  }

  const fromdate = !start_date[0] ? date[0].format('DD-MM-YYYY') : start_date[0].format('DD-MM-YYYY')
  console.log('........fromdate', fromdate)
  const todate = !start_date[1] ? date[1].format('DD-MM-YYYY') : start_date[1].format('DD-MM-YYYY')
  console.log('..........todate', todate)
  const onConfirm = () => {
    setDisableBtn({ ...disableBtn, loading: true })
    if (!isEmpty(start_date)) {
      icici_statement({
        variables: {
          start_date: fromdate,
          end_date: todate
        }
      })
    } else {
      message.error('Select Start date and End date!')
    }
  }


  const TabBarContent = () => {
    return (
      (tabIndex === '1') ?
        (
          <Space>
            <RangePicker
              size='small'
              format='DD-MM-YYYY'
              defaultValue={[date[0], date[1]]}
              value={[start_date[0], start_date[1]]}
              disabledDate={(current) => disabledendDate(current)}
              onCalendarChange={(value) =>
                setStartDate(value)}
            />
            <Button size='small' loading={disableBtn.loading} >
              <DownloadOutlined onClick={() => onConfirm()} />
            </Button>
          </Space>
        )
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
            <DatePicker onChange={handleMonthChange} picker='month' />
            : null
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
          <Last48hrsPending start_date={start_date} date={date} />
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
